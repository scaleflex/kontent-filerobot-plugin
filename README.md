<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/kai-logo-hor-neg-rgb.svg">
  <img alt="Kontent.ai logo for dark/light scheme." src="docs/kai-logo-hor-pos-rgb.svg" width="300">
</picture>
<image src="docs/filerobot.png"
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

This [custom element](https://kontent.ai/learn/tutorials/develop-apps/integrate/content-editing-extensions) extension for [Kontent.ai](https://kontent.ai) allows users to link selected assets from their [filerobot](https://www.scaleflex.com/dam-filerobot) asset library into their structured content.

## Features

- Editors can
  - Show file assets in their Filerobot project
  - Link selected assets with their content items with preview directly inside of the Kontent.ai editor

## Demo

![Demo Animation][product-demo]

## Getting started

### Running manually

The integration is created with [Create Vite App](https://vitejs.dev/). First you will need to install npm dependencies with `npm install`. Then use `npm run build` to build the integration or `npm run start` to start a local development server. See https://vitejs.dev/guide/ for more scripts.

## Filerobot configuration

You don't need to do anything special inside of your Filerobot account in order to access the data through the custom element. Instead, you'll be prompted to login into your Filerobot account to access your asset library (like seen in the demo animation above).

This element has been created by simply adding the official **Compact View** by Filerobot. You can learn more about this integration component in [its official documentation](https://docs.scaleflex.com/filerobot-documentation/headless-dam-and-api/plugins-and-connectors/connectors/kontent.ai) on filerobot's website.

> **⚠ WARNING: You have to have a Filerobot account/credentials in order to use this extension**

## Configuring the Custom Element

You will need to add the custom element to a content type filling in the hosted code URL and the following JSON parameters:

```json
{
    "token": "your_token",
    "secTemplate": "your_security_template",
    "dir": "your_base_directory"
}
```

## What is Saved

The custom element saves a list of asset objects that has been included into the content item through the element.
Example output:

```json
[
    {
    "value": "[{\"file\":{\"uuid\":\"5452c2a9-7552-568c-9434-26d30ed50000\",\"url\":{\"cdn\":\"https://famamqedb.filerobot.com/Samples/Athletics.jpg?vh=3e462d\"}}},{\"file\":{\"uuid\":\"f19c7144-ca90-5c03-a7bb-d1573f250000\",\"url\":{\"cdn\":\"https://famamqedb.filerobot.com/Samples/racing-car.jpeg?vh=4df011\"}}}]",
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
[product-demo]: docs/filerobot.gif