# React Utils

Some good utilities to use in your React Js/ React Native Apps

## Installation

`yarn add @mongez/react-utils`

Or

`npm i @mongez/react-utils`

## Usage

## Map Elements

Loop over the given array and render the given component for each element in the array.

`mapElements( data: any[], Component: React.ElementType, as: string | ((item: any, index: number) => object) = "item"): React.ReactNode`

Before:

```tsx
const posts = [
  {
    id: 1,
    title: 'Post Title 1',
    image: 'image-path.jpg'
  },
  {
    id: 2,
    title: 'Post Title 2',
    image: 'image-path-2.jpg'
  },
  {
    id: 3,
    title: 'Post Title 3',
    image: 'image-path-3.jpg'
  },
];

function LatestPosts() {
  return (
    <>
      <h3>Latest Posts</h3>
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </PostCard>
  )
}

function PostCard({ post }: any) {
  return (
    <div>
        <div className="title">{post.title}</div>
        <img src={post.image} />
    </div>
  )
}
```

After:

```tsx
import { mapElements } from '@mongez/react-';

const posts = [
  {
    id: 1,
    title: 'Post Title 1',
    image: 'image-path.jpg'
  },
  {
    id: 2,
    title: 'Post Title 2',
    image: 'image-path-2.jpg'
  },
  {
    id: 3,
    title: 'Post Title 3',
    image: 'image-path-3.jpg'
  },
];

function LatestPosts() {
  return (
    <>
      <h3>Latest Posts</h3>
      {mapElements(posts, PostCard, 'post')}
    </PostCard>
  )
}

function PostCard({ post }: any) {
  return (
    <div>
        <div className="title">{post.title}</div>
        <img src={post.image} />
    </div>
  )
}
```

You can also decide what to be passed to the component

```tsx
import { mapElements } from '@mongez/react-';

const posts = [
  {
    id: 1,
    title: 'Post Title 1',
    image: 'image-path.jpg'
  },
  {
    id: 2,
    title: 'Post Title 2',
    image: 'image-path-2.jpg'
  },
  {
    id: 3,
    title: 'Post Title 3',
    image: 'image-path-3.jpg'
  },
];

function LatestPosts() {
  return (
    <>
      <h3>Latest Posts</h3>
      {mapElements(posts, PostCard, post => ({
        title: post.title,
        image: post.image
      }))}
    </PostCard>
  )
}

function PostCard({ title, image }: any) {
  return (
    <div>
        <div className="title">{title}</div>
        <img src={image} />
    </div>
  )
}
```

Of course this function will add a unique `key` automatically so you don't have to bother yourself about it.

## Unique Keys

> Added in V1.1.0

Generating keys for the elements in the array is a good practice, but it's not always easy to do it specially if you're dealing with inputs inside the array, luckily, `uniqueKeys` utility will generate for each object.

```tsx
import { uniqueKeys } from '@mongez/react-utils';

export default function TableInputs({data}: any) {
  const [rows, setRows] = useState(uniqueKeys(data));

  const deleteRow = (index: number) => {
    setRows(rows.filter((row: any, i: number) => i !== index));
  }

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.uniqueId}>
            <input name="name[]" placeholder="Name" />

            <button type="button" onClick={deleteRow}>Delete</button>
          </tr>
        ))}
      </tbody>
    </table>
  )
```

To see the difference between using `uniqueId` and the index, try to delete the first row, you'll notice that the second row will be deleted instead of the first one.

If the array is a list of non-objects, then each element will be wrapped with an object with the key `value` and the value will be the element itself.

## Preload

Sometimes you need to preload some data before rendering the component, for example, you want to fetch the user data before rendering the profile page, or you want to fetch the list of categories before rendering the posts page, this is where `preload` utility comes in handy.

`preload( Component: React.ComponentType<any>, promise: Promise<any>, configurations: string = "data"): React.ReactNode`

```tsx

import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {data.name}</div>
      <div>Email: {data.email}</div>
    </div>
  )
}

export default preload(Profile, () => fetch('/api/user'));
```

So we passed to the preloader the component that will be rendered after the data is fetched, and the promise that will be resolved with the data, and the name of the prop that will be passed to the component.

Now the `loadingError` component will be called if the request is being loaded or any of the requests failed.

> If the sent request is a [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) the preload will handle the response automatically so you don't have to await `response.json()` or `response.text()`, the data will be returned in the response object as `response.data`.

You can define the LoadingError component by passing it to the `preload` function as the third argument.

```tsx
import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {data.name}</div>
      <div>Email: {data.email}</div>
    </div>
  )
}

export default preload(Profile, fetch('/api/user'), {
  loadingErrorComponent: ({isLoading, error}) => <div>Something went wrong</div>
});
```

You can define the default `loadingErrorComponent` using `setPreloadConfiguration` function

```tsx

import { preload, setPreloadConfiguration } from '@mongez/react-utils';

setPreloadConfiguration({
  loadingErrorComponent: ({isLoading, error}) => <div>Something went wrong</div>
});

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {data.name}</div>
      <div>Email: {data.email}</div>
    </div>
  )
}

export default preload(Profile, fetch('/api/user'));
```

You will receive `isLoading` flag to tell you if the request is being loaded, and `error` object if the request failed.

You can also send multiple requests to be loaded before rendering the component.

```tsx
import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  const [userResponse, user2Response] = response;

  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {userResponse.data.name}</div>
      <div>Email: {user2Response.data.email}</div>
    </div>
  )
}

export default preload(Profile, [
  () => fetch('/api/user'),
  () => fetch('/api/user/2'),
]);
```

Requests will be loaded

This will load both requests simultaneously before rendering the component, and the data will be passed as an `array` to the component.

### Dependant Requests

> Added in V1.1.0

Sometimes there are requests that depend on each other, for example, you want to fetch the user data first, then fetch the user's posts, this is where `dependantRequests` comes in handy.

```tsx
import { preload, dependantRequests } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {data.name}</div>
      <div>Email: {data.email}</div>
    </div>
  )
}

export default preload(Profile, dependantRequests([
  (props) => fetch('/api/user'),
  (props, userResponse, responsesList) => fetch('/api/posts?userId=' + userResponse.data.id),
]));
```

This will load the first request, then the second request, and then the third request, each request will receive the component props besides the previous responses, by receiving `responses` or if you want only to receive the previous response of the current request, you may receive `response` property, finally the data will be passed as an `array` from all requests to the component.
