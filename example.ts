import { Client, GAME_FINISHED } from "./client.ts";

const client = new Client("localhost", 2009, "EXAMPLE BOT");

await client.connect();

while (true) {
  const [init] = await client.receive();

  if (init === GAME_FINISHED) {
    break;
  }

  const [control, ...info] = await client.getReady();

  console.log(control, info);

  // TODO: implement your bot here
  const [postControl, _postInfo] = await client.lookUp();

  if (postControl === GAME_FINISHED) {
    break;
  }

  client.turnEnd();
}
