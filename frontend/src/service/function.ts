import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Item } from '@/components/form';

export function getErrorMessage(error: FetchBaseQueryError | SerializedError | unknown | string | undefined): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if ((error as SerializedError).message) return (error as SerializedError).message;
  if ((error as FetchBaseQueryError).status === 500) return '[500] Internal server error';
  const data = (error as FetchBaseQueryError).data as any;
  if (!data) return (error as any).error;
  const detail = Object.prototype.hasOwnProperty.call(data, 'detail') ? data['detail'] : null;
  if (detail) return detail;

  try {
    if (typeof data === 'object')
      return JSON.stringify(data);
    return data
  } catch {
    return data;
  }
}

export function getNewItemID(items?: { id: number | string }[]) {
  return Math.min(0, ...(items ?? []).map(r => +r.id)) - 1;
}

export function pluralize(data?: any[] | null) {
  if (!data) return ''
  return data.length > 1 ? 's' : ''
}

export function searchFilter(values: Array<Item>, search: string | undefined): Array<Item> {
  if (!search) return []
  const searchData = search.split(' ').filter(s => s).map(s => s.toLowerCase());
  return values.filter(value => {
      const valueData = value.label.split(' ').filter(v => v).map(v => v.toLowerCase());
      for (const s of searchData) {
        if (valueData.find(v => v.includes(s))) continue;
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aShow = a.label.toLowerCase();
      const bShow = b.label.toLowerCase();
      if (aShow.indexOf(search.toLowerCase()) > bShow.indexOf(search.toLowerCase())) {
        return 1;
      } else if (aShow.indexOf(search.toLowerCase()) < bShow.indexOf(search.toLowerCase())) {
        return -1;
      }
      return a.label.localeCompare(b.label)
    })
}

export function dateToString(date?: Date | string): string | undefined {
  if (!date) return undefined;
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function datetimeToString(date?: Date | string): string | undefined {
  if (!date) return undefined;
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h24',
    timeZoneName: 'short',
    timeZone: 'UTC',
  })
}

export function formatTime(rawSeconds?: number, withMs: boolean = false): string {
  if (!rawSeconds) return ''
  const hours: number = Math.floor(rawSeconds / 3600);
  const minutes: number = Math.floor(rawSeconds / 60) % 60;
  const seconds: number = Math.floor(rawSeconds) % 60;
  const ms: number = rawSeconds - seconds;

  const hPart: string = (hours > 0) ? (String(hours).padStart(2, '0') + ':') : '';
  const mPart: string = String(minutes).padStart(2, '0') + ':';
  const sPart: string = String(seconds).padStart(2, '0');
  const msPart: string = withMs ? ('.' + ms.toFixed(3).slice(-3)) : '';

  return `${ hPart }${ mPart }${ sPart }${ msPart }`;
}

export function frequencyToString(value: number): string {
  if (value < 1000) return value.toString()
  let newValue: string | number = value / 1000;
  if (newValue % 1 > 0) newValue = newValue.toFixed(1)
  return `${ newValue }k`;
}

function downloadFile(filename: string, type: string, blob: Blob) {
  const url = URL.createObjectURL(new File([ blob ], filename, { type }));
  // Using <a>-linking trick https://stackoverflow.com/a/19328891/2730032
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.type = type;
  a.download = filename;
  if (!document.body) throw new Error('Unexpectedly missing <body>');
  document.body.appendChild(a);
  a.click();
}

export async function downloadResponseHandler(response: Response, filename: string) {
  // TODO: reject errors correctly (catchable) - like a standard API error
  if (response.status !== 200) return `[${ response.status }] ${ response.statusText }`;
  const type = response.headers.get('content-type')
  if (!type) throw new Error('No file type provided')
  downloadFile(filename, type, await response.blob())
}

export function getDownloadResponseHandler(filename: string) {
  return (response: Response) => downloadResponseHandler(response, filename)
}