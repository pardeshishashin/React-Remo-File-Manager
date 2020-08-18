import React from 'react';

import FileManager, {
                      FileSelectionItem,
                      ItemView,
                      Details,
                      Column,
                      Permissions,
                      Toolbar,
                      ContextMenu,
                      Item  
                     } from 'devextreme-react/file-manager';

import { fileItems } from './files.js';


class RemoFile extends React.Component {
  constructor(props) {
    super(props);

    this.fileManagerRef = React.createRef();

    this.newFileMenuOptions = {
      items: [
        {
          text: 'Create new file',
          icon: 'plus',
           items: 
           [
            {
              text: 'Text Document',
              extension: '.txt'
             },
            {
              text: 'Word Document',
              extension: '.docx'
            }
          ]
         }
      ],
      onItemClick: this.onItemClick.bind(this)
    };

    
    this.onItemClick = this.onItemClick.bind(this);
    this.createFile = this.createFile.bind(this);
  }
  render() {
    return (
      <FileManager
        ref={this.fileManagerRef}
        fileSystemProvider={fileItems}
        onContextMenuItemClick={this.onItemClick}
        height={450}>
        <Permissions
          create={true}
          delete={true}
          rename={true}
         >
        </Permissions>
        <ItemView showParentFolder={false}>
          <Details>
            <Column dataField="thumbnail"></Column>
            <Column dataField="name"></Column>

            <Column dataField="dateModified"></Column>
            <Column dataField="size"></Column>
          </Details>
        </ItemView>
        <Toolbar>
          <Item name="showNavPane" visible="true" />
          <Item name="separator" />
          <Item name="create" />
          <Item widget="dxMenu" location="before" options={this.newFileMenuOptions} />
          <Item name="separator" location="after" />

          <FileSelectionItem name="rename" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="delete" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem widget="dxMenu" location="before" options={this.changeCategoryMenuOptions} />
          <FileSelectionItem name="clearSelection" />
        </Toolbar>
        <ContextMenu>
          <Item name="create" />
          <Item text="Create new file" icon="plus">
             <Item text="Text Document" extension=".txt" />
             <Item text="Word Document" extension=".docx" />
          </Item>
          <Item name="rename" beginGroup="true" />
          <Item name="delete" />
        
        </ContextMenu>
      </FileManager>
    );
  }

  get fileManager() {
    return this.fileManagerRef.current.instance;
  }

  onItemClick({ itemData }) {
    let updated = false;
    if(itemData.extension) {
      updated = this.createFile(itemData.extension);
    } else if(itemData.category !== undefined) {
      updated = this.updateCategory(itemData.category);
    }

    if(updated) {
      this.fileManager.refresh();
    }
  }

  createFile(fileExtension) {
    const currentDirectory = this.fileManager.getCurrentDirectory();

    const newItem = {
      __KEY__: Date.now(),
      name: `New file${ fileExtension}`,
      isDirectory: false,
      size: 0
    };

    if(currentDirectory.dataItem) {
      currentDirectory.dataItem.items.push(newItem);
    } else {
      fileItems.push(newItem);
    }
    return true;
  }

}

export default RemoFile;