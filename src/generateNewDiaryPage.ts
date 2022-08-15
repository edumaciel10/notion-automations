import { Client } from "@notionhq/client";
import { getRandomEmoji } from './getRandomEmoji.js';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..','.env') })

const diaryDatabaseId = process.env.DIARY_DATABASE 
const pageTemplateId = process.env.PAGE_TEMPLATE

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

const getPageTemplate = async (databaseId: string, pageId: string ) => {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  
  const formatter = new Intl.DateTimeFormat('pt-BR', {timeZone: 'America/Sao_Paulo'});
  const children = await getBlocksFromTemplate(pageId)

  const pageTemplate = {
    parent: {
      type: 'database_id',
      database_id: databaseId,
    },
    icon: {
      type: "emoji",
      emoji: getRandomEmoji(),
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: formatter.format(new Date()),
            },
          },
        ],
      },
      'Created Time': {
        type: 'date',
        date: {
          start: localISOTime,
          time_zone: 'America/Sao_Paulo',
        }
      }
    },
    children: children
  }
  return pageTemplate;
}

const getDatabaseSchema = async (database = diaryDatabaseId) => {
  const response = await notion.databases.retrieve({database_id: database});
  console.log(response);
}

const getPagesFromDatabase = async(database = diaryDatabase) => {
  const response = await notion.databases.query({database_id: database});
  console.log(response);
}
const getPageProperties = async(pageId) => {
  const response = await notion.pages.retrieve({page_id: pageId});
  console.log(response);
}

const createPageFromTemplate = async(template) => {
  const response = await notion.pages.create(template);
  console.log(response);
  return response;
}

const getBlocksFromTemplate = async(pageId) => {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  })
  
  return response.results;
}

export const generateNewDiaryPage = async() => {
  const pageTemplate = await getPageTemplate(diaryDatabaseId,pageTemplateId);
  return await createPageFromTemplate(pageTemplate);
};