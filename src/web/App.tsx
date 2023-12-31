import {createBrowserRouter, RouterProvider, Link} from 'react-router-dom'
import ErrorPage from './error-page'
import Root from './routes/root'
import OCRPage from './routes/ocr'
import Chat from './routes/chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // path: 'ocr',
        element: <OCRPage />
      },
      {
        path: 'chat',
        element: <Chat />
      },

    ]
  },
  {
    path: '*',
    element: <NoMatch />
  }
])

function NoMatch() {
  return (
    <div>
      <h2>It looks like you're lost...</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App