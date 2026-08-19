import { ImapFlow } from "imapflow";
import { ParsedMail, simpleParser } from "mailparser";

export async function getLatestEmail({
  email,
}: {
  email: string;
}): Promise<ParsedMail> {
  const client = new ImapFlow({
    host: process.env.TEST_IMAP_HOST ?? "",
    port: Number(process.env.TEST_IMAP_PORT ?? "993"),
    secure: process.env.TEST_IMAP_TLS === "true",
    auth: {
      user: process.env.TEST_IMAP_USER ?? "",
      pass: process.env.TEST_IMAP_PASSWORD ?? "",
    },
    logger: false,
  });

  await client.connect();

  try {
    const lock = await client.getMailboxLock("INBOX");

    try {
      const uids = await client.search(
        {
          to: email,
        },
        {
          uid: true,
        },
      );

      if (!uids || uids.length === 0) {
        throw new Error(
          "No emails found to the target email address.",
        );
      }

      const latestUid = uids[uids.length - 1];

      const message = await client.fetchOne(
        latestUid,
        {
          source: true,
        },
        {
          uid: true,
        },
      );

      if (!message || !message.source) {
        throw new Error(
          "Unable to fetch the latest email source.",
        );
      }

      return await simpleParser(message.source);
    } finally {
      lock.release();
    }
  } finally {
    try {
      await client.logout();
    } catch {
      // Connection may already be closed.
    }
  }
}
