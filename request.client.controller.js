const chalk = require("chalk");
const RequestClient = require("./models/RequestClient");

async function addRequestClient(title, client, phoneNumber) {
  let currentDate = new Date();
  await RequestClient.create({
    title,
    client,
    phone_number: phoneNumber,
    create_date: currentDate.toLocaleDateString(),
  });

  console.log(chalk.bgGreen("RequestClient was added!"));
}

async function getrequestsClient() {
  const requestsClient = await RequestClient.find();

  return requestsClient;
}

async function removeRequestClient(id, owner) {
  const result = await RequestClient.deleteOne({ _id: id, owner });

  if (result.matchedCount === 0) {
    throw new Error("No note to delete");
  }

  console.log(chalk.red(`RequestClient with id="${id}" has been removed.`));
}

async function updateRequestClient(noteData, owner) {
  const result = await RequestClient.updateOne(
    { _id: noteData.id, owner },
    { title: noteData.title }
  );

  if (result.matchedCount === 0) {
    throw new Error("No note to edit");
  }

  console.log(
    chalk.bgGreen(`RequestClient with id="${noteData.id}" has been updated!`)
  );
}

module.exports = {
  addRequestClient,
  getrequestsClient,
  removeRequestClient,
  updateRequestClient,
};
