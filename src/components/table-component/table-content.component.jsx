import './table-content.styles.css'
import Vector from '../../assets/icons/Vector.svg'
import Shape from '../../assets/icons/Shape.svg'

const TableComponent = ({data, onClicked, level, onChecked, checkedItem}) => {
    return (
        <div className='table-contents'>
        <table>
            <tr>
                <th>ACCOUNT NAME</th>
                <th>ACCOUNT TYPE</th>
                <th>ACCOUNT GROUP</th>
                <th>CLOSING BALANCE</th>
            </tr>
            {data.map((val, key) => {
              if(val.type === 1) {
                return (
                  <tr key={key}>
                    <td onClick = {onClicked} ><input type="checkbox" name="myTextEditBox"   id = {val.id} onChange={onChecked} checked={checkedItem[key]}/><img className='icon' src={Vector}  style = {{ marginLeft : level[key] * 10  }} />{ val.name}</td>
                    <td>Account type</td>
                    <td>Account Group</td>
                    <td>--</td>
                  </tr>
              )} else {
                return (
                <tr key={key}>
                <td onClick = {onClicked}><input type="checkbox" name="myTextEditBox" id = {val.id} onChange={onChecked} checked={checkedItem[key]}/><img className='icon' src={Shape} style = {{ marginLeft : level[key] * 10  }}/>{ val.name}</td>
                <td>Account type</td>
                <td>Account Group</td>
                <td>--</td>
              </tr>
            )}
          })}
        </table>
        </div>
    )
}

export default TableComponent

// checked={checkedItem.includes(val.id)}
// 


