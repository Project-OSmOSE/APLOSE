import { ACCEPT_CSV_SEPARATOR, MIME_TYPES } from '@/consts/csv';
import { useCallback, useMemo, useState } from 'react';
import { type HeaderManager, useHeaderManager } from './HeaderManager';
import * as xlsx from 'xlsx'
import { Alert } from '@/components/base/Alert/Alert';
import { useAlertContext } from '@/components/base/Alert/Provider';

export class CSVHandler<Column extends string = string, Data extends { [key in Column]?: string } = { [key in Column]?: string }> {

    private rawHeader: string[] = [];
    private _rawRows: string[][] = [];

    private _headerMapping = (header: string) => header.toLowerCase()
        .replaceAll(' ', '_') as Column
    set headerMapping(value: (header: string) => Column) {
        this._headerMapping = value;
    }

    get header(): Column[] {
        return this.rawHeader.map(raw => this._headerMapping(raw))
    }

    get rawRows(): string[][] {
        return this._rawRows;
    }

    get rows(): Data[] {
        return this.rawRows.map(row => ({
            ...this.rawHeader.reduce((previousValue, header, index) => ({
                ...previousValue,
                [this._headerMapping(header)]: row[index],
            }), {}),
        } as Data));
    }

    async loadFile(file: File): Promise<{ header: string[], rows: string[][] }> {
        const { header, rows } = await new Promise<{ header: string[], rows: string[][] }>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onerror = () => reject('Error reading file, check the file isn\'t corrupted')
            reader.onload = (event) => {
                const result = event.target?.result;
                if (!result || typeof result !== 'string') {
                    reject('The file is empty or it does not contain a string content.')
                    return;
                }

                const lines = result.replaceAll('"', '').replaceAll('\r', '').split(/\n/).filter(l => !!l)
                const rows = lines.map(l => l.split(ACCEPT_CSV_SEPARATOR)).filter(l => !!l)

                // let rows = result.replaceAll('\r', '').split('\n').map(l => [ l ]);
                // rows = rows.map(l => l.flatMap(l => l.split(ACCEPT_CSV_SEPARATOR))).filter(d => d.length > 1);
                if (rows.length === 0) reject('The CSV is empty')

                rows.reverse()
                const header = rows.pop()!
                rows.reverse()
                resolve({ header, rows })
            }
        })
        this._rawRows = rows;
        this.rawHeader = header;
        return { header, rows }
    }


    rowToNumber(data: any): number | undefined {
        if (data === undefined || data === null || data.length === 0 || isNaN(+data)) return undefined
        return +data
    }
}


export type SpreadsheetHandler<
    Data extends Record<string, string> = Record<string, string>,
    Key extends string = string,
> = {
    rows: Data[] | null,
    loadFile: (file: File) => Promise<{ rows: Data[], headers: string[] }>,
    reset: () => void,

    header: HeaderManager<Key>,

    setDefaultValue: (rawHeader: string, data: string, value: any) => void,
    getDefaultValue: (rawHeader: string, data: string) => any,
}

type Spreadsheet = {
    headers: string[],
    rows: string[][]
}

function readCSV(file: File): Promise<Spreadsheet> {
    return new Promise<Spreadsheet>((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsText(file, 'UTF-8');
        reader.onerror = () => reject('Error reading file, check the file isn\'t corrupted')
        reader.onload = (event) => {
            const result = event.target?.result;
            if (!result || typeof result !== 'string') {
                reject('The file is empty or it does not contain a string content.')
                return;
            }

            const lines = result.replaceAll('"', '').replaceAll('\r', '').split(/\n/).filter(l => !!l)
            const rows = lines.map(l => l.split(ACCEPT_CSV_SEPARATOR)).filter(l => !!l)

            if (rows.length === 0) reject('The CSV is empty')

            rows.reverse()
            const headers = rows.pop()!
            rows.reverse()
            resolve({ headers, rows })
        }
    })
}

async function readXLSX(file: File, openAlert: (alert: Alert<any>) => void): Promise<Spreadsheet> {
    const excelFile = xlsx.read(await file.arrayBuffer(), { type: 'buffer' })

    let sheetName = excelFile.SheetNames[0]
    if (excelFile.SheetNames.length > 1) {
        sheetName = await new Promise<string>((resolve, reject) => {
            openAlert({
                title: 'Choose a sheet',
                message: 'Choose a sheet from your spreadsheet to import data from',
                buttons: excelFile.SheetNames.map(sheet => ({
                    type: 'Confirm',
                    text: sheet,
                    confirmData: sheet,
                })),
                onCancel: () => reject('No sheet chosen'),
                onConfirm: resolve,
            })
        })
    }
    const sheet = excelFile.Sheets[sheetName]

    function charCode(letter: string) {
        return letter.charCodeAt(0) - 'A'.charCodeAt(0)
    }

    const cells = Object.entries(sheet)
        .filter(([ cellName ]) => cellName[0] !== '!')
        .reduce((returnArray, [ cellName, cell ]) => {
            const columnLetters = cellName.match(/[A-Z]+/g)?.pop()
            if (columnLetters === undefined) return returnArray
            const columnIndex = columnLetters.split('')
                .map((letter, index) => index === (columnLetters.length - 1) ? charCode(letter) : ((charCode(letter) + 1) * (charCode('Z') + 1)))
                .reduce((a,b) => a+b, 0)
            if (columnIndex !== undefined) {
                const rowIndex = cellName.match(/\d+/g)?.pop()
                if (rowIndex !== undefined) {
                    if (returnArray[+rowIndex] === undefined) returnArray[+rowIndex] = []
                    returnArray[+rowIndex][columnIndex] = cell.w
                }
            }
            return returnArray
        }, [] as string[][])

    const rows = Object.values(cells)
    rows.reverse()
    const headers = rows.pop()!
    rows.reverse()
    return { headers, rows }
}

function formatRows<Type>(headers: string[], rows: string[][]): Type[] {
    return rows.map((row) => ({
        ...row.reduce((previousValue, cell, index) => ({
            ...previousValue,
            [headers[index]]: cell,
        }), {} as Type),
    }) as Type);
}

export const useSpreadsheetHandler = <
    Data extends Record<string, string> = Record<string, string>,
    Key extends string = string,
>(
    allKeys: Key[],
    multipleKeys: Key[],
): SpreadsheetHandler<Data, Key> => {
    const { openAlert } = useAlertContext()
    const [ rawHeader, setRawHeader ] = useState<string[] | null>(null)
    const [ rawRows, setRawRows ] = useState<string[][] | null>(null)
    const [ defaultValues, setDefaultValues ] = useState<Map<string, any>>(new Map())

    const headerManager = useHeaderManager<Key>(allKeys, multipleKeys, rawHeader || [])

    const rows = useMemo(() => {
        if (!rawHeader || !rawRows) return null
        return formatRows<Data>(rawHeader, rawRows);
    }, [ rawHeader, rawRows ]);

    const readFile = useCallback((file: File): Promise<Spreadsheet> => {
        switch (file.type) {
            case MIME_TYPES.csv:
                return readCSV(file)
            case MIME_TYPES.xlsx:
                return readXLSX(file, openAlert)
            default:
                throw `Invalid MIME Type, found : ${ file.type } ; but accepted types are: ${ [ MIME_TYPES.csv, MIME_TYPES.xlsx ].join(', ') }`
        }
    }, [ openAlert ])
    const loadFile = useCallback(async (file: File) => {
        const { headers, rows } = await readFile(file)
        setRawHeader(headers)
        setRawRows(rows)
        headerManager.selectRaws(headers)
        return {rows: formatRows<Data>(headers, rows), headers}
    }, [ readFile, headerManager ])

    const reset = useCallback((): void => {
        setRawHeader(null)
        setRawRows(null)
    }, [])

    return {
        rows,
        loadFile, reset,
        header: headerManager,

        getDefaultValue: useCallback((header: string, data: string) => {
            return defaultValues.get(`${ header } ${ data }`)
        }, [ defaultValues ]),
        setDefaultValue: useCallback((header: string, data: string, value: any) => {
            setDefaultValues(prev => {
                prev.set(`${ header } ${ data }`, value)
                return new Map(prev)
            })
        }, [ setDefaultValues ]),
    }
}

export type FormDataName<Key extends string> = `${ number }-${ Key }`

export class SpreadsheetFormData<Key extends string> extends FormData {

    get(name: FormDataName<Key>): string | null {
        return super.get(name) as string | null;
    }

    getBoolean(name: FormDataName<Key>): boolean {
        return this.get(name) === 'true'
    }

    getNumber(name: FormDataName<Key>): number | undefined {
        const data = this.get(name)
        return data === null ? undefined : +data
    }

    getUTCDate(name: FormDataName<Key>): string | undefined {
        const data = this.get(name)
        return data === null ? undefined : new Date(data + 'Z').toISOString()
    }

    getAll(name: FormDataName<Key>): string[] {
        return super.getAll(name) as string[];
    }
}
