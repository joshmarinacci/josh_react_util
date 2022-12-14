import {
    HBox,
} from "../index";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React, {ChangeEvent, useContext, useState, KeyboardEvent} from "react";
import {CellRef, CellRenderer, DataGrid, DataSource, useAutoFocus} from "../datagrid";

export default {
    title:"DataGrid",
    component: DataGrid,
} as ComponentMeta<typeof DataGrid>;


class JSONDataSource<T extends Record<string,any>> implements DataSource {
    private data: T[];
    constructor(data:T[]) {
        this.data = data
    }
    rowCount(): number {
        return this.data.length
    }
    columnNames(): string[] {
        let first:T = this.data[0]
        return Object.keys(first)
    }
    getValueAt2<E extends keyof T>(row:number, col:E) {

    }
    getValueAt(cell:CellRef): any {
        return this.data[cell.row][cell.col]
    }
    setValueAt(cell:CellRef, value: any) {
        let row:Record<string, any> = this.data[cell.row]
        row[cell.col] = value
    }
    isEditableAt(cell:CellRef) {
        return true
    }
}
type Person = {
    first:string,
    last:string,
    age:number,
}
const data:Person[] = [
    {first:'bob',last:'smith', age:5},
    {first:'alice',last:'kim', age:6},
    {first:'josh',last:'marinacci', age:7},
]

export const Standard: ComponentStory<typeof DataGrid> = () => {
    const DS = new JSONDataSource<Person>(data)
    DS.getValueAt2(1,"age")

    return <div className={'wrapper'}>
        <DataGrid source={DS}/>
    </div>
}

class EvenDataSource implements DataSource {
    private length: number;
    private fields: string[];
    constructor() {
        this.length = 100
        this.fields = ['number','type','date','color','prime']
    }
    rowCount() {
        return this.length
    }
    columnNames() {
        return this.fields
    }
    getValueAt(cell:CellRef):any {
        let name = cell.col
        if(name === 'number') return cell.row
        if(name === 'type') {
            if(cell.row % 2 === 0) {
                return 'even'
            } else {
                return 'odd'
            }
        }
        if(name === 'date') return new Date()
        if(name === 'color') return '#4488ff'
        if(name === 'prime') return false
        return "???"
    }
    setValueAt(cell:CellRef, value: string) {
        console.error('not really setting value to',value)
    }
    isEditableAt(cell:CellRef): boolean {
        return false
    }
}

export const Long:ComponentStory<typeof DataGrid> = () => {
    const DS = new EvenDataSource()
    return <div className={'wrapper'}>
        <DataGrid source={DS}/>
    </div>
}
function NumberEditor(props:{cell:CellRef, value:number, source:DataSource, stopEditing:()=>any}) {
    const [value, set_value] = useState(props.value)
    const ref = useAutoFocus<HTMLInputElement>()
    const keydown = (e:KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if(e.key === 'Escape' || e.key === 'Enter') {
            props.source.setValueAt(props.cell, value)
            props.stopEditing()
        }
    }
    const changed = (e:ChangeEvent<HTMLInputElement>) => set_value(parseInt(e.target.value))
    return <input ref={ref} type={'number'} value={value} onKeyDown={keydown} onChange={changed}/>
}

class MyCellRenderer implements CellRenderer {
    renderCellView(cell: CellRef, value: any): JSX.Element | string {
        //return a custom element
        if(cell.col === 'color') return <label style={{backgroundColor: value}}>{value}</label>
        //convert to string in different ways
        if(typeof value === 'string') return value as string
        if(typeof value === 'number') return value + ""
        if(typeof value === 'boolean') return value?"true":"false"
        if(value instanceof Date) return value.toDateString()
        return "???"
    }
    renderCellEditor(cell:CellRef, value:any, source:DataSource, stopEditing:()=>any): JSX.Element | null {
        if(cell.col === 'age') return <NumberEditor  cell={cell} value={value} stopEditing={stopEditing}
                                                     source={source}
        />
        return null
    }
}

export const CustomRenderer:ComponentStory<typeof DataGrid> = () => {
    const dataSource = new EvenDataSource()
    let renderer = new MyCellRenderer()
    return <div className={'wrapper'}>
        <DataGrid source={dataSource} cellRenderer={renderer}/>
    </div>
}
