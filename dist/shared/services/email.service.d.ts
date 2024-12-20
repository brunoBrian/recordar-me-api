export declare class EmailService {
    private transporter;
    constructor();
    sendPaymentConfirmation(email: string, amount: number): Promise<void>;
}
