/**
 * Invoice generated mail — sent when a new invoice is created.
 */
import { BaseMailable } from '@formwork/mail';

export class InvoiceMail extends BaseMailable {
  constructor(
    private recipientEmail: string,
    private orgName: string,
    private amount: string,
    private invoiceUrl: string,
  ) {
    super();
  }

  build(): this {
    return this
      .to(this.recipientEmail)
      .subject(`Invoice for ${this.orgName} — ${this.amount}`)
      .toMessage(`
        <h1>New Invoice</h1>
        <p>Your invoice for <strong>${this.orgName}</strong> is ready.</p>
        <table style="margin:1rem 0;">
          <tr><td>Amount:</td><td><strong>${this.amount}</strong></td></tr>
          <tr><td>Organization:</td><td>${this.orgName}</td></tr>
        </table>
        <p><a href="${this.invoiceUrl}" style="background:#4361ee;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">View Invoice</a></p>
      `);
  }
}
