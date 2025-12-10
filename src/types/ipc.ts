declare global {
    interface Window {
        ipcRenderer: {
            invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
        };
    }
}

export interface IPCResponse {
    success: boolean;
    [key: string]: unknown;
}
