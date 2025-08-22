export class HttpError extends Error {
  status: number;

  private static messageList: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
  };

  constructor(status: number, message?: string) {
    const msg = message ?? HttpError.messageList[status] ?? "Server Error";
    super(msg);

    this.status = status;
    this.name = "HttpError";

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
