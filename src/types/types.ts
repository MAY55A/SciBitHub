type FileWithPreview = File & { preview: string | null };
type FileFromPath = {name: string, type: string, path: string, preview: string | null, size: number};
