# Nested tree UI
This component mainly designed for table column/menu item manipulation with minimal effort.

[Demo](https://lakshmanan-arumugam.github.io/nested-tree/)

![Reference image](https://i.ibb.co/xspPpJB/Screenshot-2021-11-08-at-6-00-54-AM.png)

## Features
* Persist data and state
* Provide an option to search items at any level
* Reorder items at sibling level
* Option to edit/delete item (Inline operation handle)
* Select all children items when the parent item gets selected
* Provide an option to select each item in a tree and select a parent item if all child items selected

## Component
In Nested tree UI component developed by the following components.

| Component | Info |
| ------ | ------ |
| CheckBox group | Contains group of checkbox element with accordion |
| CheckBox with Dragger | Custom checkbox with inline edit textbox, edit and delete operation buttons |
| Column customize container | Main tree UI search, filter, add and remove operation |

## Installation
First clone the project files from this report and go to the project directory in your system. Run the below commands in your terminal:
```
 $ yarn install
 $ yarn start
```

## Plugins
Nested tree UI is currently extended with the following plugins.

[React sortable hoc](https://github.com/clauderic/react-sortable-hoc)

## Deploy
You can deploy this repo code into your github account using the below command
```
$ yarn deploy
```

## License

MIT
