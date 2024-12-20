export declare class FirebaseService {
    private firestore;
    constructor();
    create(collection: string, id: string, data: any): Promise<void>;
    get(collection: string, id: string): Promise<any>;
}
