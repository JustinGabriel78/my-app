import { useEffect, useState } from 'react';
import './App.css';
import './components/table-component/table-content.component.jsx'
import TableComponent from './components/table-component/table-content.component.jsx';
import { firstBox, secondBox, thirdBox } from './data';



const App = () => {
  const [mainData, setMainData] = useState([]) 
  const [topLevelComponents, setTopLevelComponents] = useState([])
  const [displayedComponents, setDisplayedComponents] = useState(topLevelComponents);
  const [checkedItem, setCheckedItem]= useState([])
  const [flag , setFlag] = useState([])
  const [level, setLevel] = useState([])

  useEffect ( () => {
    setMainData([...firstBox])
    setTopLevelComponents([...firstBox])
    const flag = firstBox.map((tabledata) => {
      return {id: tabledata.id , isOpen:false}
    })
    const level = firstBox.map(() => 0)
    const isChecked = firstBox.map((data) => false) 
    setFlag(flag)
    setLevel(level)
    setCheckedItem(isChecked)
    
  },[])
  useEffect( () => {
    const mainComponent = topLevelComponents.filter( (tabledata) => tabledata.parentId === null)
    setDisplayedComponents(mainComponent)
  },[mainData])

  useEffect ( () => {
    setDisplayedComponents(topLevelComponents)
  },[checkedItem])


const onClicked = (event) => {
  if(event.target.firstChild) {
      const id = event.target.firstChild.id;
      const isFlag = flag.find(item => item.id === +id).isOpen
      let component = [];
      let levels = [];
      
      const recursion = (data, id) => {
        for(let i = 0; i < data.length; i++) {
          if( data[i].id === +id && data[i].parentId === null) {
              const parentId = data[i].id
              return recursion(secondBox,parentId)
  
          }else if(data[i].parentId === +id) {
             const dataLevels = firstBox.find(datas => datas.id === data[i].parentId) ? 2 : 4             
              levels.push(dataLevels)
              component.push(data[i])
              const parentId = data[i].id              
              recursion(thirdBox,parentId)
  
          }else if (data[i].id === +id && data[i].type === 0) {
              const parentId = data[i].id
              recursion(thirdBox,parentId)
            }
          }
      }

      recursion(topLevelComponents,id)
      const item = topLevelComponents.find(data => data.id === +id)
      const index = topLevelComponents.indexOf(item) ;
      if(!isFlag){        
        topLevelComponents.splice(index + 1,0,...component);
        level.splice(index + 1,0,...levels);
        const topLevelComponentsClone = [...topLevelComponents];
        const levelClone = [...level]
        const newFlags = component.map((item) => {
          return {id: item.id , isOpen:true}
        })
        flag[index].isOpen = true
        flag.splice(index + 1 ,0,...newFlags)
        const flagClone = flag
        setFlag(flagClone)
        setLevel(levelClone)
        setTopLevelComponents(topLevelComponentsClone)
        setDisplayedComponents(topLevelComponents)
        if(checkedItem[index]){
          onClickedChecked(id)
        } else {
          console.log("checked: ",checkedItem)
          console.log("length",component.length)
          const checks = component.map(() => false )
          checkedItem.splice(index+1,0,...checks )
        }
      } else {
        const completeComponent = component.filter((item,index) => component.indexOf(item) === index); // avoid duplicate items
        const componentLength = completeComponent.filter(item => topLevelComponents.includes(item) ).length
        topLevelComponents.splice(index + 1,componentLength);
        level.splice(index + 1,componentLength);
        const topLevelComponentsClone = [...topLevelComponents];
        const levelClone = [...level]
        flag.splice(index + 1, componentLength)
        flag[index].isOpen = false
        const flagClone = flag
        setFlag(flagClone)
        setLevel(levelClone)
        setTopLevelComponents(topLevelComponentsClone)
        setDisplayedComponents(topLevelComponents)
        if(checkedItem[index]) {
          onUnclickedChecked(index,componentLength)
        }else {
          console.log("checked: ",checkedItem)
          console.log("length",componentLength)
          checkedItem.splice(index+1,componentLength)
        }
        
      }
    }

  }

  const onClickedChecked = (id) => {

    const checked = []

    const checkRecursion = (data,id) => {
      for (let i =0 ; i< data.length; i++) {
        if(data[i].parentId === +id) {
          checked.push(true)
          const id = data[i].id
          checkRecursion(data,id)
        }
        
      }
    }

    const item = topLevelComponents.find(data => data.id === +id)
    const index = topLevelComponents.indexOf(item) ;

    checkRecursion(topLevelComponents,id)
    if(topLevelComponents.length === checkedItem.length) {
      console.log("index: ",index)
      console.log("checked.length: ",checked.length)
      console.log("checked: ",checked)
      checkedItem.splice(index + 1, checked.length, ...checked)
      console.log("checkedItemsss:",checkedItem)
    } else {
      checkedItem.splice(index + 1,0,...checked)
    }
    
    const checkedItemClone = [...checkedItem]
    setCheckedItem(checkedItemClone)
  }

  const onUnclickedChecked = (index,componentLength) => {
    checkedItem.splice(index+1,componentLength)
    console.log("🚀 ~ file: App.js:154 ~ onUnclickedChecked ~ checkedItem:", checkedItem)
    const checkedItemClone = [...checkedItem]
    console.log("checkedItemClone: ",checkedItemClone)
    setCheckedItem(checkedItemClone)
  } 

  const onChecked = (event) => {
    
    const id = event.target.id    
    const checked = []
    const checkRecursion = (data,id) => {
      for (let i =0 ; i< data.length; i++) {
        if(data[i].parentId === +id) {
          checked.push(true)
          const id = data[i].id
          checkRecursion(data,id)
        }
        
      }
    }

    const uncheckRecursion = (data,id) => {
      for (let i =0 ; i< data.length; i++) {
        if(data[i].parentId === +id) {
          checked.push(false)
          const id = data[i].id
          uncheckRecursion(data,id)
        }
        
      }
    }

    
    const item = topLevelComponents.find(data => data.id === +id)
    const index = topLevelComponents.indexOf(item) ;
    const isChecked = checkedItem[index]
    if(!isChecked){
      checkRecursion(topLevelComponents,id)
      checkedItem[index] = true
      if(topLevelComponents.length === checkedItem.length) {
        checkedItem.splice(index + 1, checked.length, ...checked)
      } else {
        checkedItem.splice(index + 1,0,...checked)
      }
      console.log("onchechecked!ischeked",checkedItem)
      const checkedItemClone = [...checkedItem]
      setCheckedItem(checkedItemClone)
    }else { 
      uncheckRecursion(topLevelComponents,id)
      checkedItem[index] = false;
      const uncheckedLength = checked.length
      checkedItem.splice(index + 1, +uncheckedLength, ...checked)
      const checkedItemClone = [...checkedItem]
      setCheckedItem(checkedItemClone)
    }

  }
  



  return (
    <div className="App">
      <div className="head"> 
        <p>Chart of Accounts</p>
        <button id="create-button">Create</button>
      </div>
      <TableComponent 
      data = { displayedComponents }
      level = {level}
      checkedItem = {checkedItem}
      onClicked = {onClicked}
      onChecked = {onChecked}
      />
    </div>
  )
 }

export default App;
