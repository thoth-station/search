import React from 'react';
import {AppProvider} from "../src/providers/app"
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw'
import { THOTH_URL } from "config";
import { Route, Routes, BrowserRouter } from 'react-router-dom';


export const parameters = {
  options: {
    storySort: {
      order: ['atoms', 'molecules', "organisms", 'templates', 'pages'],
    },
  },
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // msw: {
  //   handlers: [
  //     rest.get(THOTH_URL + "/advise/python/adviser-220719131518-f9cde332e97c5073", (req, res, ctx) => {
  //         return res(
  //           ctx.status(200),
  //           ctx.json(generateAdviseDocumentSuccess)
  //         )
  //     })
  //   ]
  // }
}


// Initialize MSW
initialize();

export const decorators = [
  (Story) => (
    <AppProvider defaultState={{
      active: {
        analysis_id: "adviser-220329062130-e66ea4b2a189ee44",
        selected_package: "jinja2"
      }
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Story />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  ),
  mswDecorator
]