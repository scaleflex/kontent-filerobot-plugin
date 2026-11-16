<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/kai-logo-hor-neg-rgb.svg">
  <img alt="Kontent.ai logo for dark/light scheme." src="docs/kai-logo-hor-pos-rgb.svg" width="300">
</picture>
<image src="docs/SCALEFLEX-LOGO.svg"
alt="commercetools logo" width="300">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-deploy">Deploy</a> •
  <a href="#configuring-the-custom-element">Configuration</a> •
  <a href="#what-is-saved">Saved value</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a> •
  <a href="#additional-resources">Resources</a>
</p>

This [custom element](https://kontent.ai/learn/tutorials/develop-apps/integrate/content-editing-extensions) extension for [Kontent.ai](https://kontent.ai) allows users to link selected assets from their [Scaleflex DAM](https://www.scaleflex.com/visual-asset-management) asset library into their structured content.

## Features

- Editors can
  - Browse, search and filter assets in their Scaleflex DAM project
  - Upload new assets directly from the picker
  - Link selected assets with their content items with preview directly inside of the Kontent.ai editor

## Demo
Request to Us
[Demo][product-demo]

## Getting started

### Running manually

The integration is created with [Vite](https://vitejs.dev/). First you will need to install npm dependencies with `npm install`. Then use `npm run build` to build the integration into `dist/` or `npm run dev` to start a local development server. See https://vitejs.dev/guide/ for more scripts.

## Scaleflex DAM configuration

The element is built on the official [Scaleflex Asset Picker](https://www.npmjs.com/package/@scaleflex/asset-picker) (`sfx-asset-picker`) and the [Scaleflex Uploader](https://www.npmjs.com/package/@scaleflex/uploader), both loaded from the Scaleflex CDN.

Editors don't need to log in. The picker authenticates with a **project token** and a **security template key**, which you create in your Scaleflex DAM project settings. The permissions of the security template define what editors can see and do (e.g. browse only, or also upload).

> **⚠ WARNING: You have to have a Scaleflex DAM account/credentials in order to use this extension**

## Configuring the Custom Element

You will need to add the custom element to a content type filling in the hosted code URL and the following JSON parameters:

```json
{
    "token": "your_project_token",
    "secTemplate": "your_security_template_key",
    "rootPath": "/your/base/directory/"
}
```

| Parameter | Required | Description |
|---|---|---|
| `token` | Yes | Scaleflex DAM project token |
| `secTemplate` | Yes | Security template key |
| `rootPath` | No | Folder the picker opens in. Default: `/` |
| `assetPickerConfig` | No | Extra [Asset Picker options](https://scaleflex.github.io/asset-picker/#/docs/getting-started), as a JSON object or JSON string. Overrides the defaults below |
| `uploaderConfig` | No | Extra [Uploader options](https://scaleflex.github.io/uploader/#/docs/getting-started), merged into `uploader`. Set to `null` to disable uploading |

Defaults applied by the element: `multiSelect`, `showMetadata`, `rememberLastTab`, `rememberLastFolder`, `rememberLastView`, `folderCreation` and `humanReadableMetadata` are `true`, and the uploader enforces required metadata before upload (`enforceRequiredBeforeUpload: "auto"`).

### Examples

Only allow images and videos (editors cannot remove this filter):

```json
{
    "token": "your_project_token",
    "secTemplate": "your_security_template_key",
    "assetPickerConfig": {
        "forcedFilters": {
            "type": { "type": "string", "values": ["image", "video"] }
        }
    }
}
```

Use `defaultFilters` instead of `forcedFilters` to pre-apply a filter that editors can remove.

Single selection, no upload, with image cropping:

```json
{
    "token": "your_project_token",
    "secTemplate": "your_security_template_key",
    "assetPickerConfig": {
        "multiSelect": false,
        "crop": true
    },
    "uploaderConfig": null
}
```

## What is Saved

The custom element saves a list of asset objects that has been included into the content item through the element. Each asset stores its `uuid`, CDN URL (the selected variant or crop when one was chosen) and MIME type.
Example output:

```json
[
    {
    "value": "[{\"file\":{\"uuid\":\"5452c2a9-7552-568c-9434-26d30ed50000\",\"url\":{\"cdn\":\"https://famamqedb.filerobot.com/Samples/Athletics.jpg?vh=3e462d\"},\"type\":\"image/jpeg\"}},{\"file\":{\"uuid\":\"f19c7144-ca90-5c03-a7bb-d1573f250000\",\"url\":{\"cdn\":\"https://famamqedb.filerobot.com/Samples/racing-car.jpeg?vh=4df011\"},\"type\":\"image/jpeg\"}}]",
    "searchableValue": null,
    "elementId": "5a8b014e-5f5d-4f3d-a8db-3c4c60faff72",
    "name": "Untitled custom element",
    "type": "CONTENTELEMENT_CUSTOM",
    "lastModifiedBy": "64e1c4fa1d338e5346a52b49",
    "lastModifiedAt": "2023-09-27T04:39:58.2474293Z"
    }
],
```

## Contributors

We have collected notes on how to contribute to this project in [CONTRIBUTING.md](CONTRIBUTING.md).

<a href="https://github.com/scaleflex/kontent-filerobot-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=scaleflex/kontent-filerobot-plugin" />
</a>


## License

[MIT](https://tldrlegal.com/license/mit-license)

## Additional Resources

- [Kontent.ai Integration documentation](https://kontent.ai/learn/tutorials/develop-apps/integrate/integrations-overview)
- [Custom Element documentation](https://kontent.ai/learn/tutorials/develop-apps/integrate/content-editing-extensions)
- [Custom Element API reference](https://kontent.ai/learn/reference/custom-elements-js-api)


[contributors-url]: https://github.com/scaleflex/kontent-filerobot-plugin/graphs/contributors
[product-demo]: https://www.scaleflex.com/request-a-demo