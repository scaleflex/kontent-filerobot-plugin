let kontentStoredAssets = [];
const minHeight = 100;
const pickerHeight = 650;
const rowHeight = 170;

const DEFAULT_PICKER_CONFIG = {
    multiSelect: true,
    showMetadata: true,
    rememberLastTab: true,
    rememberLastFolder: true,
    rememberLastView: true,
    folderCreation: true,
    humanReadableMetadata: true,
    crop: true
};

function updateDisabled(disabled) {
    if (disabled) {
        document.getElementById('filerobotOpenModalBtn').classList.add('hidden')
    }
    else {
        document.getElementById('filerobotOpenModalBtn').classList.remove('hidden')
    }
}

function buildHeight(files) {
    const filesCount = files.length;
    if (filesCount > 0) {
        // Add Assets button stays visible above the grid, so keep minHeight for it
        const rows = Math.ceil(filesCount / 6);
        CustomElement.setHeight(minHeight + rowHeight * rows);
    } else {
        CustomElement.setHeight(minHeight);
    }
}

function withSize(url, width, height) {
    try {
        const u = new URL(url);
        u.searchParams.set('width', width);
        u.searchParams.set('height', height);
        return u.toString();
    } catch (e) {
        return url;
    }
}

function buildHtml(selected) {
    const assetUrl = selected.file.url.cdn;
    const divElement = document.createElement('div');
    divElement.classList = "rounded p-2 border shadow relative removeItemParent";
    divElement.setAttribute("data-uuid", selected.file.uuid);
    const type = (selected.file.type || '').split("/")[0];
    if (type == 'image') {
        const imgElement = document.createElement('img');
        imgElement.src = withSize(assetUrl, 200, 200);
        imgElement.classList = "w-32 h-32 mx-auto rounded";
        divElement.appendChild(imgElement);
    } else {
        const divTypeElement = document.createElement('div');
        divTypeElement.innerText = selected.file.type;
        divTypeElement.classList = "w-32 h-32 mx-auto rounded";
        divElement.appendChild(divTypeElement);
    }

    const removeElement = document.createElement('div');
    removeElement.classList = "absolute right-0 top-0 cursor-pointer";

    const removeIconElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    removeIconElement.innerHTML = `
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
                `;
    removeIconElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    removeIconElement.setAttribute("fill", "currentColor");
    removeIconElement.classList = "w-6 h-6 text-red-500 hover:text-red-900 removeItem";

    removeElement.appendChild(removeIconElement);
    divElement.appendChild(removeElement)

    document.getElementById('filerobotImages').appendChild(divElement);
}

function loadError() {
    document.getElementById('message').innerText = "Please provide a token and secure template";
    document.getElementById('messageWrapper').classList.remove('hidden');
    document.getElementById('filerobotOpenModalBtn').classList.add('hidden');
}

// Kontent.ai element config is JSON, so options may arrive as objects or as JSON strings
function parseOption(value, name) {
    if (value === undefined || value === '') return undefined;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch (e) {
        console.error(`${name}: invalid JSON`, e);
        return undefined;
    }
}

function buildPickerConfig(config) {
    const { token, secTemplate, rootPath } = config;
    const extraConfig = parseOption(config.assetPickerConfig, 'assetPickerConfig') ?? {};
    const extraUploaderConfig = parseOption(config.uploaderConfig, 'uploaderConfig');

    const pickerConfig = {
        auth: {
            mode: 'securityTemplate',
            securityTemplateKey: secTemplate,
            projectToken: token,
        },
        uploader: {
            metadataConfig: {
                enforceRequiredBeforeUpload: 'auto',
            },
        },
        rootFolderPath: rootPath || '/',
        displayMode: 'inline',
        ...DEFAULT_PICKER_CONFIG,
        ...extraConfig,
    };

    // "uploader": null (in assetPickerConfig or uploaderConfig) removes the uploader entirely
    if (pickerConfig.uploader === null || extraUploaderConfig === null) {
        delete pickerConfig.uploader;
    } else {
        pickerConfig.uploader = {
            ...pickerConfig.uploader,
            ...(extraUploaderConfig ?? {}),
        };
    }

    // Image crop needs transformations enabled (image-crop script is loaded in index.html)
    if (pickerConfig.crop === true) {
        pickerConfig.transformations = true;
    }

    return pickerConfig;
}

function getAssetCdnUrl(asset) {
    const variantUrl = asset.selectedVariant?.url;
    const variantCdn = typeof variantUrl === 'string' ? variantUrl : variantUrl?.cdn;
    return variantCdn
        ?? asset.transformation?.url?.cdn
        ?? asset.transformation?.url?.permalink_cdn
        ?? asset.url?.cdn;
}

document.addEventListener("DOMContentLoaded", function () {
    const pickerContainer = document.getElementById('filerobotPickerContainer');
    let pickerConfig = null;

    // A new picker element on every open, so no selection or state is carried over
    function mountPicker() {
        pickerContainer.replaceChildren();
        const picker = document.createElement('sfx-asset-picker');
        picker.config = pickerConfig;
        pickerContainer.appendChild(picker);
    }

    function closeModal() {
        document.getElementById('filerobotWidgetWrapper').classList.add('hidden');
        pickerContainer.replaceChildren();
    }

    function loadAssetPicker(config) {
        pickerConfig = buildPickerConfig(config);

        // Picker events bubble (composed), so listen once on the container
        pickerContainer.addEventListener('ap-select', function (e) {
            const assets = e.detail?.assets ?? [];
            console.log('[asset-picker] selected assets:', assets);
            assets.forEach(asset => {
                console.log('[asset-picker]', asset.uuid, {
                    url: asset.url?.cdn,
                    selectedVariant: asset.selectedVariant,
                    transformation: asset.transformation,
                    crop: asset.crop,
                    saved: getAssetCdnUrl(asset),
                });
            });

            assets.forEach(asset => {
                const index = kontentStoredAssets.findIndex(item => item.file.uuid === asset.uuid);

                if (index === -1) {
                    const storeData = {
                        file: {
                            uuid: asset.uuid,
                            url: {
                                cdn: getAssetCdnUrl(asset)
                            },
                            type: asset.mime || asset.type
                        }
                    }

                    kontentStoredAssets.push(storeData);
                    buildHtml(storeData);
                }
            });

            closeModal();
            buildHeight(kontentStoredAssets);
            CustomElement.setValue(JSON.stringify(kontentStoredAssets));
        });

        pickerContainer.addEventListener('ap-cancel', function () {
            closeModal();
            buildHeight(kontentStoredAssets);
        });

        pickerContainer.addEventListener('ap-error', function (e) {
            console.error('[asset-picker]', e.detail?.context, e.detail?.error);
        });
    }

    CustomElement.init((element, _context) => {
        const value = element.value;
        const files = JSON.parse(value);
        const config = element.config;

        if (config && config.token && config.secTemplate) {
            if (files) {
                kontentStoredAssets = files.filter(function (file) { return file.hasOwnProperty('file') });
            } else {
                kontentStoredAssets = [];
            }

            kontentStoredAssets.forEach(function (selected) {
                buildHtml(selected)
            })
            buildHeight(kontentStoredAssets)
            updateDisabled(element.disabled);
            CustomElement.onDisabledChanged(updateDisabled);
            loadAssetPicker(config);
            return;
        }
        loadError();
    });

    const openModalBtn = document.getElementById('filerobotOpenModalBtn');
    const closeModalBtn = document.getElementById('filerobotCloseModalBtn');
    openModalBtn.addEventListener('click', function () {
        if (!pickerConfig) return;
        CustomElement.setHeight(pickerHeight);
        mountPicker();
        document.getElementById('filerobotWidgetWrapper').classList.remove('hidden');
    })

    closeModalBtn.addEventListener('click', function () {
        closeModal();
        buildHeight(kontentStoredAssets);
    })

    document.getElementById('filerobotImages').addEventListener('click', function (event) {
        if (event.target.classList.contains('removeItem') || event.target.closest('.removeItem')) {
            const parentItem = event.target.closest('.removeItemParent');
            const uuid = parentItem.getAttribute('data-uuid');
            const filteredData = kontentStoredAssets.filter(item => item.file.uuid !== uuid);
            kontentStoredAssets = filteredData;
            CustomElement.setValue(JSON.stringify(filteredData));
            parentItem.remove();
            buildHeight(kontentStoredAssets);
        }
    });

});
