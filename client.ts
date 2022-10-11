export const TURN_START = "@";
export const TURN_END = "#";
export const GAME_FINISHED = "0";

export class Client {
  #host;
  #port;
  #name;
  #connection?: Deno.TcpConn;

  constructor(host: string, port: number, name = "CHASER CLIENT DENO 0.0") {
    this.#host = host;
    this.#port = port;
    this.#name = name;
  }

  async connect() {
    this.#connection = await Deno.connect({
      hostname: this.#host,
      port: this.#port,
    });
    await this.#sendName();
  }

  async receive() {
    const buf = new TextDecoder().decode(await this.#receiveBuffer());

    const control = buf[0];
    if ([GAME_FINISHED, TURN_START].includes(control)) {
      return [control];
    }

    return buf.trim().split("");
  }

  async getReady() {
    await this.#sendCommand("gr");
    return await this.receive();
  }

  async turnEnd() {
    await this.#sendCommand(TURN_END);
  }

  async walkUp() {
    await this.#sendCommand("wu");
    return await this.receive();
  }

  async walkRight() {
    await this.#sendCommand("wr");
    return await this.receive();
  }

  async walkDown() {
    await this.#sendCommand("wd");
    return await this.receive();
  }

  async walkLeft() {
    await this.#sendCommand("wl");
    return await this.receive();
  }

  async lookUp() {
    await this.#sendCommand("lu");
    return await this.receive();
  }

  async lookRight() {
    await this.#sendCommand("lr");
    return await this.receive();
  }

  async lookDown() {
    await this.#sendCommand("ld");
    return await this.receive();
  }

  async lookLeft() {
    await this.#sendCommand("ll");
    return await this.receive();
  }

  async searchUp() {
    await this.#sendCommand("su");
    return await this.receive();
  }

  async searchRight() {
    await this.#sendCommand("sr");
    return await this.receive();
  }

  async searchDown() {
    await this.#sendCommand("sd");
    return await this.receive();
  }

  async searchLeft() {
    await this.#sendCommand("sl");
    return await this.receive();
  }

  async putUp() {
    await this.#sendCommand("pu");
    return await this.receive();
  }

  async putRight() {
    await this.#sendCommand("pr");
    return await this.receive();
  }

  async putDown() {
    await this.#sendCommand("pd");
    return await this.receive();
  }

  async putLeft() {
    await this.#sendCommand("pl");
    return await this.receive();
  }

  async #sendCommand(command: string) {
    await this.#connection?.write(new TextEncoder().encode(`${command}\r\n`));
  }

  async #sendName() {
    await this.#sendCommand(this.#name);
  }

  async #receiveBuffer() {
    const buf = new Uint8Array(512);
    const n = await this.#connection?.read(buf);
    if (n) {
      return buf.subarray(0, n);
    }
  }
}
