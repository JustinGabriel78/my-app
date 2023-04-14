import { useEffect, useState } from "react";
import "./ChartOfAccounts.css";
import TableComponent from "../../common/table-component/table-content.component";
import { firstBox, secondBox, thirdBox } from "../../data";

const ChartOfAccounts = () => { 
  const [mainData, setMainData] = useState([]) 
  const [topLevelComponents, setTopLevelComponents] = useState([]);
  const [displayedComponents, setDisplayedComponents] = useState(topLevelComponents);
  const [checkedItem, setCheckedItem] = useState([]);
  const [flag, setFlag] = useState([]);
  const [level, setLevel] = useState([]);

  useEffect(() => {
    const flag = firstBox.map((tabledata) => ({id: tabledata.id , isOpen:false}))
    const level = firstBox.map(() => 0);
    const IsChecked = firstBox.map(() => false);

    setMainData([...firstBox])
    setTopLevelComponents([...firstBox]);
    setFlag(flag);
    setLevel(level);
    setCheckedItem(IsChecked);
  }, []);

  useEffect(() => {
    const mainComponent = topLevelComponents.filter((tabledata) => tabledata.parentId === null);
    setDisplayedComponents(mainComponent);
  }, [mainData]);

  useEffect(() => {
    setDisplayedComponents(topLevelComponents);
  }, [checkedItem]);


  /**
   * Function which is called when clicking the table item
   * @param {*} event 
   */
  const onClicked = (event) => {
    if (event.target.firstChild) {
      const id = event.target.firstChild.id;
      const component = [];
      const levels = [];
      const item = topLevelComponents.find((data) => data.id === +id);
      const index = topLevelComponents.indexOf(item);
      const isFlag = flag.find(item => item.id === +id).isOpen
      /**
       * Function used to find the children of the corresponding data
       * @param {array} data 
       * @param {Integer} id 
       * @returns 
       */

      let treeFlag = false;
      const recursion = (data, id) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === +id && data[i].parentId === null) {
            const parentId = data[i].id;
            treeFlag = !treeFlag
            return recursion(secondBox, parentId);
          } else if (data[i].parentId === +id) {
            const dataLevels = firstBox.find((datas) => datas.id === data[i].parentId)? 2: 4;
            levels.push(dataLevels);
            component.push(data[i]);
            const parentId = data[i].id;
            if(!treeFlag){
              recursion(thirdBox, parentId);
            }
            
          } else if (data[i].id === +id && data[i].type === 0) {
            const parentId = data[i].id;
            recursion(thirdBox, parentId);
          }
        }
      };


      /**
       * Function used to set the state
       * @param {array} topLevelComponents 
       * @param {Integer} level 
       * @param {Boolean} flag 
       */
      const setState = (topLevelComponents, level, flag) => {
        const topLevelComponentsClone = [...topLevelComponents];
        const levelClone = [...level];
        const flagClone = flag;
        setFlag(flagClone);
        setLevel(levelClone);
        setTopLevelComponents(topLevelComponentsClone);
        setDisplayedComponents(topLevelComponents); 
      };

      recursion(topLevelComponents, id);

      if (!isFlag) {
        const newFlags = component.map((tabledata) => ({id: tabledata.id , isOpen:false}) )
        flag[index].isOpen = true
        flag.splice(index + 1, 0, ...newFlags);
        topLevelComponents.splice(index + 1, 0, ...component);
        level.splice(index + 1, 0, ...levels);

        if (checkedItem[index]) {
          onCheckedClicked(id);
        } else {
          const checks = component.map(() => false);
          checkedItem.splice(index + 1, 0, ...checks);
        }
        setState(topLevelComponents, level, flag);

      } else {
        let top = [...topLevelComponents]
        console.log("toplevel: ",top)
        console.log("component",component)

        const completeComponent = component.filter((item, index) => component.indexOf(item) === index); // avoid duplicate items

        const parentIds = new Set(completeComponent.map(component => component.id));
        const subComponentLength = topLevelComponents.filter(component => parentIds.has(component.parentId)).length;
        const componentLength = completeComponent.filter((item) =>topLevelComponents.includes(item)).length;
        const totalcomponentLength = componentLength + subComponentLength
        flag[index].isOpen = false
        topLevelComponents.splice(index + 1, totalcomponentLength);
        level.splice(index + 1, totalcomponentLength);
        flag.splice(index + 1, totalcomponentLength);

        if (checkedItem[index]) {
          onCheckedUnclicked(index, totalcomponentLength);
        } else {
          checkedItem.splice(index + 1, totalcomponentLength  );
        }
        setState(topLevelComponents, level, flag);

      }
    }
  };

  /**
   * Function is called when the clickbox is already checked and then clicks the corresponding table data 
   * @param {Integer} id - id of the corresponding table data
   */
  const onCheckedClicked = (id) => {
    const item = topLevelComponents.find((data) => data.id === +id);
    const index = topLevelComponents.indexOf(item);
    const checked = CheckedAndUnchecked(topLevelComponents, id ,true);

    if (topLevelComponents.length === checkedItem.length) {
      checkedItem.splice(index + 1, checked.length, ...checked);
    } else {
      checkedItem.splice(index + 1, 0, ...checked);
    }

    const checkedItemClone = [...checkedItem];
    setCheckedItem(checkedItemClone);
  };

  /**
   * Function is called when the clickbox is already checked and then unclicks the corresponding table data 
   * @param {Integer} index - Index of the corresponding table data
   * @param {Integer} componentLength - Length of the children data of the clicked table data 
   */
  const onCheckedUnclicked = (index, componentLength) => {
    checkedItem.splice(index + 1, componentLength);
    const checkedItemClone = [...checkedItem];
    setCheckedItem(checkedItemClone);
  };

  const checked =[];

  /**
   * Function to mark checked and Unchecked
   * @param {array} data - Data that pass to the recursion
   * @param {Integer} id - Id of the corresponding table data
   * @param {Boolean} checkedStatus - If the checkbox corresponding to the table data is checked or not
   * @returns 
   */
  const CheckedAndUnchecked  = (data, id, checkedStatus) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === +id) {
        checked.push(checkedStatus);
        const id = data[i].id;
        CheckedAndUnchecked(data, id,checkedStatus);
      }
    }
    return checked
  };


  /**
   * Function is called when checking and unchecking the checkbox
   * @param {*} event 
   */
  const onChecked = (event) => {
    const id = event.target.id;
    const item = topLevelComponents.find((data) => data.id === +id);
    const index = topLevelComponents.indexOf(item);
    const isChecked = checkedItem[index];

    /**
     * 
     * @param {Boolean} checkedStatus 
     */
    const settingCheckedItem = (checkedStatus) => {
      checkedItem[index] = checkedStatus;
      const checkedItemClone = [...checkedItem];
      setCheckedItem(checkedItemClone);
    }

    if (!isChecked) {
      const checked = CheckedAndUnchecked(topLevelComponents, id,true);
      if (topLevelComponents.length === checkedItem.length) {
        checkedItem.splice(index + 1, checked.length, ...checked);
      } else {
        checkedItem.splice(index + 1, 0, ...checked);
      }
      settingCheckedItem(true)
    } else {
      const checked = CheckedAndUnchecked(topLevelComponents, id,false);
      const uncheckedLength = checked.length;
      checkedItem.splice(index + 1, +uncheckedLength, ...checked);
      settingCheckedItem(false)
    }
  };

  return (
    <div className="App">
      <div className="head">
        <p>Chart of Accounts</p>
        <button id="create-button">Create</button>
      </div>
      <TableComponent
        data={displayedComponents}
        level={level}
        checkedItem={checkedItem}
        onClicked={onClicked}
        onChecked={onChecked}
      />
    </div>
  );
};

 export default ChartOfAccounts;


