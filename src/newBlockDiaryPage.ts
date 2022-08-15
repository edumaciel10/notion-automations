import { Client } from "@notionhq/client";
import { getRandomEmoji } from './getRandomEmoji.js';

import path, { dirname } from 'path';
import dotenv from 'dotenv';

import { fileURLToPath } from 'node:url';
import moment from 'moment';

dotenv.config({ path: path.resolve(__dirname, '..','.env') })

const diaryDatabaseId = process.env.DIARY_DATABASE 

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

const getLastPageFromDatabase = async(database = diaryDatabaseId) => {
  const response = await notion.databases.query({
    database_id: database,
    sorts: [
      {
        property: 'Created Time',
        direction: 'descending',
      }
    ]
  });
  return response.results[0].id;
}

const appendText = async(pageId, content) => {
  var date = moment(date).format('HH:mm:ss');

  const response = await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        "heading_2": {
          "rich_text": [
            {
              "text": {
                "content": date,
              }
            }
          ]
        }
      },
      {
        "paragraph": {
          "rich_text": [
            {
              "text": {
                "content": content
              }
            }
          ]
        }
      }
    ],
  });
  console.log({response});
  return response;
}

export const newBlockDiaryPage = async(message ?: string) => {
  const lastPageId = await getLastPageFromDatabase(diaryDatabaseId);
  const content = message ?? process.argv.slice(2).join(' ');
  return await appendText(lastPageId, content);
}