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
    
  },[])
  useEffect( () => {
    const mainComponent = topLevelComponents.filter( (tabledata) => tabledata.parentId === null)
    setDisplayedComponents(mainComponent)
  },[mainData])

  useEffect( () => {
    const flag = firstBox.map((tabledata) => {
      return {id: tabledata.id , isOpen:false}
    })
    const level = firstBox.map(() => 0)
    const isChecked = firstBox.map((data) => {
      return {id: data.id , isCheck:false}
    }) 
    setFlag(flag)
    setLevel(level)
    setCheckedItem(isChecked)
    
  },[])

  useEffect ( () => {
    setDisplayedComponents(topLevelComponents)
  },[checkedItem])
const onClicked = (event) => {
  if(event.target.firstChild) {
      const id = event.target.firstChild.id;
      const isFlag = flag.find(fla => fla.id === +id).isOpen
      let component = [];
      let levels = [];
      
      const recursion = (data, id) => {
        for(let i = 0; i < data.length; i++) {
          if( data[i].id === +id && data[i].parentId === null) {
              const parentId = data[i].id
              return recursion(secondBox,parentId)
  
          }else if(data[i].parentId === +id) {
            console.log("firstBox:",firstBox)
             const levelss = firstBox.find(datas => datas.id === data[i].parentId) ? 2 : 4             
              levels.push(levelss)
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
        const subcomp = [...topLevelComponents];
        const sublevels = [...level]
        const flags = component.map((item) => {
          return {id: item.id , isOpen:true}
        })
        flag[index].isOpen = true
        flag.splice(index + 1 ,0,...flags)
        const newFlags = flag
        setFlag(newFlags)
        setLevel(sublevels)
        setTopLevelComponents(subcomp)
        setDisplayedComponents(topLevelComponents)
      } else {
        const completeComponent = component.filter((item,index) => component.indexOf(item) === index); // avoid duplicate items
        console.log("🚀 ~ file: App.js:84 ~ onChecked ~ completeComponent:", completeComponent)
        const componentLength = completeComponent.filter(item => topLevelComponents.includes(item) ).length
        console.log("🚀 ~ file: App.js:87 ~ onChecked ~ componentLen:", componentLength)

        topLevelComponents.splice(index + 1,componentLength);
        level.splice(index + 1,componentLength);
        const subcomp = [...topLevelComponents];
        const sublevels = [...level]
        flag.splice(index + 1, componentLength)
        flag[index].isOpen = false
        const newFlags = flag
        setFlag(newFlags)
        setLevel(sublevels)
        setTopLevelComponents(subcomp)
        setDisplayedComponents(topLevelComponents)
      }
      // onChecked()
      console.log("component: ",component)
      console.log("topLevelComponents: ",topLevelComponents)
      console.log("level:",level)
    }

  }

  const onChecked = (event,data) => {
    console.log("🚀 ~ file: App.js:117 ~ onChecked ~ data:", data)
    console.log("event.target.id",event.target.id)
    const id = event.target.id ||event.target.firstChild.id
    // const isChecked = checkedItem.find( item => item.id === +id )
    console.log("🚀 ~ file: App.js:118 ~ onChecked ~ isChecked:", checkedItem)
    const checked = []
    const recursion = (data,id) => {
      for (let i =0 ; i< data.length; i++) {
        if(data[i].parentId === +id) {
          checked.push({id: data.id , isCheck:true})
          const id = data[i].id
          recursion(data,id)
        }
        
      }
    }

    recursion(topLevelComponents,id)
    const item = topLevelComponents.find(data => data.id === +id)
    const index = topLevelComponents.indexOf(item) ;
    console.log("🚀 ~ file: App.js:128 ~ onChecked ~ index:", index)
    checkedItem[index].isCheck = true
    checkedItem.splice(index + 1,0,...checked)
    const checks = [...checkedItem]
    console.log("🚀 ~ file: App.js:131 ~ onChecked ~ checks:", checks)
    setCheckedItem(checks)
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
