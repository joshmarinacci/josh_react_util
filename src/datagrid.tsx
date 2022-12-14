import React, {KeyboardEvent, RefObject, useEffect, useRef, useState} from "react";
import {toClass} from "./index";
import "./datagrid.css"

export interface CellRef {
    row:number,
    col:string,
}
export interface DataSource {
    rowCount(): number
    columnNames(): string[]
    getValueAt(cell:CellRef): any
    setValueAt(cell:CellRef, value: any): void
    isEditableAt(cell:CellRef): boolean
}

export interface CellRenderer {
    renderCellView(cell: CellRef, value: any): JSX.Element | string
    renderCellEditor(cell: CellRef, value: any, source: DataSource, stopEditing: () => any): JSX.Element | null
}

export function useAutoFocus<E extends HTMLElement>():RefObject<E> {
    const ref = useRef<E>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.focus()
        }
    })
    return ref
}


function CellEditor(props: { source: DataSource, cell:CellRef, stopEditing: () => any }) {
    const {cell, source} = props
    const [value, setValue] = useState<string>(() => source.getValueAt(cell))
    const ref = useAutoFocus<HTMLInputElement>()
    return <input
        ref={ref}
        type={'text'}
        value={value}
        onKeyDown={e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                source.setValueAt(cell, value)
                props.stopEditing()
            }
        }}
        onChange={(e) => setValue(e.target.value)}/>
}

function SelectedCell(props: {
    cell:CellRef,
    selected: CellRef,
    setSelected: (cell:CellRef) => any
    source: DataSource,
    cellRenderer:CellRenderer,
}) {
    const {cell} = props
    // const ref = useRef(null)
    const ref = useAutoFocus<HTMLTableDataCellElement>()
    const [editing, set_editing] = useState(false)

    const onKeyPress = (e: KeyboardEvent<HTMLTableDataCellElement>) => {
        if (e.key === 'Enter' && !editing) {
            if (props.source.isEditableAt(props.cell)) {
                set_editing(true)
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (props.cell.row > 0) {
                props.setSelected({row:cell.row-1,col:cell.col})
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (props.cell.row < props.source.rowCount() - 1) {
                props.setSelected({row:cell.row+1,col:cell.col})
            }
        }
        if (e.key === 'ArrowLeft') {
            let n = props.source.columnNames().indexOf(props.cell.col)
            if (n > 0) {
                n = n - 1
            }
            let col = props.source.columnNames()[n]
            props.setSelected({row:cell.row,col:col})
        }
        if (e.key === 'ArrowRight') {
            let n = props.source.columnNames().indexOf(props.cell.col)
            if (n >= 0 && n < props.source.columnNames().length - 1) {
                n = n + 1
            }
            let col = props.source.columnNames()[n]
            props.setSelected({row:cell.row,col:col})
        }
    }
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({behavior: 'auto', block: "nearest", inline: 'nearest'})
        }
    })
    let content = <span>{props.cellRenderer.renderCellView(props.cell, props.source.getValueAt(props.cell))}</span>

    let clss = {
        selected: true,
        editing: editing,
    }

    if (editing) {
        let editor = props.cellRenderer.renderCellEditor(
            props.cell,
            props.source.getValueAt(props.cell),
            props.source,
            () => set_editing(false)
        );
        if(!editor) editor = <CellEditor  source={props.source} cell={props.cell} stopEditing={() => set_editing(false)}/>
        content = editor
    }

    return <td ref={ref} className={toClass(clss)} tabIndex={0} onKeyDown={onKeyPress}>{content}</td>
}

function DataCell(props: {
    source: DataSource,
    cell:CellRef,
    selected: CellRef,
    setSelected: (cell:CellRef) => any,
    cellRenderer:CellRenderer
}) {
    const set_selected = () => {
        props.setSelected(props.cell)
    }
    if (props.selected.col === props.cell.col && props.selected.row === props.cell.row) {
        return (<SelectedCell source={props.source}
                              cell={props.cell}
                              selected={props.selected}
                              setSelected={props.setSelected}
                              cellRenderer={props.cellRenderer}
        />)
    } else {
        return <td onClick={set_selected}>{props.cellRenderer.renderCellView(props.cell, props.source.getValueAt(props.cell))}</td>
    }
}

function DataRow(props: {
    source: DataSource,
    row: number,
    selected: CellRef,
    setSelected: (cell:CellRef) => any,
    cellRenderer:CellRenderer

}) {
    let names = props.source.columnNames()
    let cols = names.map((name, i) => {
        return <DataCell key={name}
                         source={props.source}
                         cell={{row:props.row,col:name}}
                         selected={props.selected}
                         setSelected={props.setSelected}
                         cellRenderer={props.cellRenderer}
        />
    })
    let cls = {
        selected:props.selected.row === props.row
    }
    return <tr className={toClass(cls)}>
        <th className={'row-header'}>{props.row}</th>
        {cols}
    </tr>
}

function DataHeader(props: { source: DataSource }) {
    let names = props.source.columnNames()
    return <tr>
        <th className={'empty col-header'}>&nbsp;</th>
        {names.map((name, i) => {
            return <th key={i} className={'col-header'}>{name}</th>
        })}
    </tr>
}

class StringCellRenderer implements CellRenderer {
    renderCellEditor(cell: CellRef, value: any, source: DataSource, stopEditing: () => any): JSX.Element | null {
        return null
    }

    renderCellView(cell: CellRef, value: any): JSX.Element | string {
        return value + ""
    }

}
export function DataGrid(props: { source: DataSource, cellRenderer?:CellRenderer }) {
    const [selected, set_selected] = useState<CellRef>({row:0,col:'unknown'})
    const cellRenderer = props.cellRenderer || new StringCellRenderer()
    let rows = []
    for (let i = 0; i < props.source.rowCount(); i++) {
        rows.push(<DataRow key={i} row={i} source={props.source}
                           selected={selected}
                           setSelected={set_selected}
                           cellRenderer={cellRenderer}
        />)
    }
    return <table>
        <thead>
        <DataHeader source={props.source}/>
        </thead>
        <tbody>
        {rows}
        </tbody>
    </table>
}
