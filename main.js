let kontentStoredAssets = [];
const minHeight = 100;
let token = false;
let secTemplate = false;
let rootPath = '/';
let countFiles = 0;

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
        const rows = Math.ceil(filesCount / 6);
        const newHeight = (250 * rows);
        CustomElement.setHeight(newHeight);
    } else {
        CustomElement.setHeight(minHeight);
    }
}

function buildHtml(selected) {
    const assetUrl = selected.file.url.cdn;
    const divElement = document.createElement('div');
    divElement.classList = "rounded p-2 border shadow relative removeItemParent";
    divElement.setAttribute("data-uuid", selected.file.uuid);
    const type =  selected.file.type.split("/")[0];
    if (type == 'image') {
        const imgElement = document.createElement('img');
        imgElement.src = assetUrl + '&width=200&height=200';
        imgElement.classList = "w-32 h-32 mx-auto rounded";
        divElement.appendChild(imgElement);
    } else {
        const divTypeElement = document.createElement('div');
        divTypeElement.innerHTML =  selected.file.type;
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

document.addEventListener("DOMContentLoaded", function () {
    function loadFilerobot() {
        const Filerobot = window.Filerobot;

        if (token && secTemplate && rootPath) {
            const filerobot = Filerobot.Core({
                securityTemplateID: secTemplate,
                container: token,
                dev: false
            });

            // Plugins
            const Explorer = Filerobot.Explorer;
            const XHRUpload = Filerobot.XHRUpload;

            filerobot
                .use(Explorer, {
                    config: {
                        rootFolderPath: rootPath
                    },
                    target: '#filerobotWidget',
                    inline: true,
                    inline: true,
                    width: '100%',
                    height: '100%',
                    resetAfterClose: true,
                    disableExportButton: false, // default: false, if the page name = filerobot-fmaw the value is true
                    hideExportButtonIcon: true,
                    preventExportDefaultBehavior: true,
                    disableDownloadButton: false,
                    hideDownloadButtonIcon: true,
                    preventDownloadDefaultBehavior: true,
                    noImgOperationsAndDownload: true, // default: false, if the page name = filerobot-fmaw the value is true
                    hideDownloadTransformationOption: true,
                    disableFileResolutionFallback: true,
                    showFoldersTree: false,
                    defaultFieldKeyOfBulkEditPanel: 'title',
                    locale: {
                        strings: {
                            mutualizedExportButtonLabel: 'Insert',
                            mutualizedDownloadButton: 'Insert',
                        },
                    },
                })
                .use(XHRUpload)
                .on('export', function (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) {
                    buildHeight(files)
                    files.forEach((selected, key) => {
                        const index = kontentStoredAssets.findIndex(item => item.file.uuid === selected.file.uuid);

                        if (index === -1) {
                            const storeData = {
                                file: {
                                    uuid: selected.file.uuid,
                                    url: {
                                        cdn: selected.file.url.cdn
                                    },
                                    type: selected.file.type
                                }
                            }
                            
                            kontentStoredAssets.push(storeData);
                            buildHtml(selected);
                        }
                    });

                    if (files.length > 0) {
                        document.getElementById('filerobotOpenModalBtn').classList.add('hidden')
                        countFiles = files.length
                    }
                    closeModal();
                    CustomElement.setValue(JSON.stringify(kontentStoredAssets));
                });
        }
    }

    CustomElement.init((element, _context) => {
        const value = element.value;
        const files = JSON.parse(value);
        const config = element.config;

        if (config) {
            token = config.token ? config.token : false;
            secTemplate = config.secTemplate ? config.secTemplate : false;
            rootPath = config.rootPath ? config.rootPath : rootPath;

            if (token && secTemplate) {
                if (files) {
                    kontentStoredAssets = files.filter(function(file) { return file.hasOwnProperty('file') });
                } else {
                    kontentStoredAssets = [];
                }

                if (kontentStoredAssets.length > 0) {
                    document.getElementById('filerobotOpenModalBtn').classList.add('hidden')
                    files.forEach(function (selected, key) {
                        buildHtml(selected)
                    })
                    countFiles = files.length
                    buildHeight(files)
                } else {
                    CustomElement.setHeight(minHeight);
                }
                CustomElement.onDisabledChanged(updateDisabled);
                loadFilerobot();
                return;
            }
        }
        loadError();
    });

    function closeModal(newHeight) {
        document.getElementById('filerobotWidgetWrapper').classList.add('hidden');
    }

    const openModalBtn = document.getElementById('filerobotOpenModalBtn');
    const closeModalBtn = document.getElementById('filerobotCloseModalBtn');
    openModalBtn.addEventListener('click', function () {
        CustomElement.setHeight(650);
        document.getElementById('filerobotWidgetWrapper').classList.remove('hidden');
    })

    closeModalBtn.addEventListener('click', function () {
        closeModal();
        buildHeight(kontentStoredAssets);
    })

    document.getElementById('filerobotImages').addEventListener('click', function(event) {
        if (event.target.classList.contains('removeItem') || event.target.closest('.removeItem')) {
            const parentItem =  event.target.closest('.removeItemParent');
            const uuid = parentItem.getAttribute('data-uuid');
            const filteredData = kontentStoredAssets.filter(item => item.file.uuid !== uuid);
            kontentStoredAssets = filteredData;
            CustomElement.setValue(JSON.stringify(filteredData));
            countFiles -= 1
            if (countFiles == 0) {
                document.getElementById('filerobotOpenModalBtn').classList.remove('hidden')
            }
            parentItem.remove();
        }
    });

});




