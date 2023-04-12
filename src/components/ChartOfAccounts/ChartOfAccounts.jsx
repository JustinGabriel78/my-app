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
    const level = firstBox.map(() => 0);
    const FlagAndIsChecked = firstBox.map(() => false);

    setMainData([...firstBox])
    setTopLevelComponents([...firstBox]);
    setFlag(FlagAndIsChecked);
    setLevel(level);
    setCheckedItem(FlagAndIsChecked);
  }, []);

  useEffect(() => {
    const mainComponent = topLevelComponents.filter((tabledata) => tabledata.parentId === null);
    setDisplayedComponents(mainComponent);
  }, [mainData]);

  useEffect(() => {
    setDisplayedComponents(topLevelComponents);
  }, [checkedItem]);

  const onClicked = (event) => {
    if (event.target.firstChild) {
      const id = event.target.firstChild.id;
      let component = [];
      let levels = [];
      const item = topLevelComponents.find((data) => data.id === +id);
      const index = topLevelComponents.indexOf(item);
      const isFlag = flag[index]

      const recursion = (data, id) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === +id && data[i].parentId === null) {
            const parentId = data[i].id;
            return recursion(secondBox, parentId);
          } else if (data[i].parentId === +id) {
            const dataLevels = firstBox.find((datas) => datas.id === data[i].parentId)? 2: 4;
            levels.push(dataLevels);
            component.push(data[i]);
            const parentId = data[i].id;
            recursion(thirdBox, parentId);
          } else if (data[i].id === +id && data[i].type === 0) {
            const parentId = data[i].id;
            recursion(thirdBox, parentId);
          }
        }
      };

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
        const newFlags = component.map(() => true )
        flag[index] = true
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
        const completeComponent = component.filter((item, index) => component.indexOf(item) === index); // avoid duplicate items
        const componentLength = completeComponent.filter((item) =>topLevelComponents.includes(item)).length;
        flag[index] = false
        topLevelComponents.splice(index + 1, componentLength);
        level.splice(index + 1, componentLength);
        flag.splice(index + 1, componentLength);

        if (checkedItem[index]) {
          onCheckedUnclicked(index, componentLength);
        } else {
          checkedItem.splice(index + 1, componentLength);
        }
        setState(topLevelComponents, level, flag);

      }
    }
  };

  const onCheckedClicked = (id) => {
    const item = topLevelComponents.find((data) => data.id === +id);
    const index = topLevelComponents.indexOf(item);
    const checked = CheckedAndUncheckedDuringRecursion(topLevelComponents, id ,true);

    if (topLevelComponents.length === checkedItem.length) {
      checkedItem.splice(index + 1, checked.length, ...checked);
    } else {
      checkedItem.splice(index + 1, 0, ...checked);
    }

    const checkedItemClone = [...checkedItem];
    setCheckedItem(checkedItemClone);
  };

  const onCheckedUnclicked = (index, componentLength) => {
    checkedItem.splice(index + 1, componentLength);
    const checkedItemClone = [...checkedItem];
    setCheckedItem(checkedItemClone);
  };

  const checked =[];

  const CheckedAndUncheckedDuringRecursion  = (data, id, checkedStatus) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === +id) {
        checked.push(checkedStatus);
        const id = data[i].id;
        CheckedAndUncheckedDuringRecursion(data, id,checkedStatus);
      }
    }
    return checked
  };

  const onChecked = (event) => {
    const id = event.target.id;
    const item = topLevelComponents.find((data) => data.id === +id);
    const index = topLevelComponents.indexOf(item);
    const isChecked = checkedItem[index];

    const settingCheckedItem = (checkedStatus) => {
      checkedItem[index] = checkedStatus;
      const checkedItemClone = [...checkedItem];
      setCheckedItem(checkedItemClone);
    }

    if (!isChecked) {
      const checked = CheckedAndUncheckedDuringRecursion(topLevelComponents, id,true);
      if (topLevelComponents.length === checkedItem.length) {
        checkedItem.splice(index + 1, checked.length, ...checked);
      } else {
        checkedItem.splice(index + 1, 0, ...checked);
      }
      settingCheckedItem(true)
    } else {
      const checked = CheckedAndUncheckedDuringRecursion(topLevelComponents, id,false);
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

// import { useEffect, useState, useCallback } from "react";
// import "./ChartOfAccounts.css";
// import TableComponent from "../../common/table-component/table-content.component";
// import { firstBox, secondBox, thirdBox } from "../../data";

// const ChartOfAccounts = () => {
//   const [mainData, setMainData] = useState([]);
//   const [topLevelComponents, setTopLevelComponents] = useState([]);
//   const [displayedComponents, setDisplayedComponents] = useState([]);
//   const [checkedItem, setCheckedItem] = useState([]);
//   const [flag, setFlag] = useState([]);
//   const [level, setLevel] = useState([]);

//   const dataMap = {};

//   const handleClick = useCallback(
//     (id) => {
//       const item = dataMap[id];
//       const index = topLevelComponents.indexOf(item);
//       const isFlag = flag[index];

//       const { component, levels } = getSubtree(topLevelComponents, id);

//       if (!isFlag) {
//         const newFlags = component.map(() => true);
//         flag[index] = true;
//         flag.splice(index + 1, 0, ...newFlags);
//         topLevelComponents.splice(index + 1, 0, ...component);
//         level.splice(index + 1, 0, ...levels);

//         if (checkedItem[index]) {
//           handleCheck(id, false);
//         } else {
//           const checks = component.map(() => false);
//           checkedItem.splice(index + 1, 0, ...checks);
//         }
//       } else {
//         const completeComponent = component.filter(
//           (item, index) => component.indexOf(item) === index
//         );
//         const componentLength = completeComponent.filter((item) =>
//           topLevelComponents.includes(item)
//         ).length;
//         flag[index] = false;
//         topLevelComponents.splice(index + 1, componentLength);
//         level.splice(index + 1, componentLength);
//         flag.splice(index + 1, componentLength);

//         if (checkedItem[index]) {
//           handleCheck(id, false);
//         } else {
//           checkedItem.splice(index + 1, componentLength);
//         }
//       }

//       setCheckedItem([...checkedItem]);
//       setFlag([...flag]);
//       setLevel([...level]);
//       setTopLevelComponents([...topLevelComponents]);
//       setDisplayedComponents(topLevelComponents);
//     },
//     [checkedItem, dataMap, flag, level, topLevelComponents]
//   );

// }




 export default ChartOfAccounts;


