b# React Utils

Some good utilities to use in your React Js/ React Native Apps

## Installation

`yarn add @mongez/react-utils`

Or

`npm i @mongez/react-utils`

## Usage

## Map Elements

Loop over the given array and render the given component for each element in the array.

`mapElements( data[], Component: React.ElementType, as: string | ((item, index: number) => object) = "item"): React.ReactNode`

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
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </PostCard>
  )
}

function PostCard({ post }) {
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
import { mapElements } from '@mongez/react-utils';

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

function PostCard({ post }) {
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
import { mapElements } from '@mongez/react-utils';

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

function PostCard({ title, image }) {
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

Generating keys for the elements in the array is a good practice, but it's not always easy to do it specially if you're dealing with inputs inside the array, luckily, `uniqueKeys` utility will generate a unique id for each object.

```tsx
import { uniqueKeys } from '@mongez/react-utils';

export default function TableInputs({data}) {
  const [rows, setRows] = useState(uniqueKeys(data));

  const deleteRow = (index: number) => {
    setRows(rows.filter((row, i: number) => i !== index));
  }

  const addRow = () => {
    setRows(uniqueKeys([...rows, {
      name: ''
    }]));
  }

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.uniqueId}>
          <td>
            <input name="name[]" placeholder="Name" />
          </td>
          <td>
          </td>
            <button type="button" onClick={deleteRow}>Delete</button>
          </tr>
        ))}
        <tr>
          <td colSpan={2}>
            <button type="button" onClick={addRow}>Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
```

The `uniqueId` key is generated automatically and it's unique for each object in the array, so you can use it as the key for the element, if the `uniqueId` already exists, then it will be used instead of generating new one.

To see the difference between using `uniqueId` and the index, use the `index` instead of the `uniqueId` as key for the `tr` tag then try to delete the first row, you'll notice that the second row will be deleted instead of the first one.

If the array is a list of non-objects, then each element will be wrapped with an object with the key `value` and the value will be the element itself.

```tsx
import { uniqueKeys } from '@mongez/react-utils';

export default function TableInputs({data}) {
  const [rows, setRows] = useState(uniqueKeys([1, 2, 3, 4]));

  const deleteRow = (index: number) => {
    setRows(rows.filter((row, i: number) => i !== index));
  }

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.uniqueId}>
            <input name="name[]" placeholder="Name" value={row.value} />

            <button type="button" onClick={deleteRow}>Delete</button>
          </tr>
        ))}
      </tbody>
    </table>
  )
```

You can also assign a different key name instead of `uniqueId` by passing it as the second argument.

```tsx
import { uniqueKeys } from '@mongez/react-utils';

export default function TableInputs({data}) {
  const [rows, setRows] = useState(uniqueKeys([1, 2, 3, 4], 'id'));

  const deleteRow = (index: number) => {
    setRows(rows.filter((row, i: number) => i !== index));
  }

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id}>
            <input name="name[]" placeholder="Name" value={row.value} />

            <button type="button" onClick={deleteRow}>Delete</button>
          </tr>
        ))}
      </tbody>
    </table>
  )
```

## Preload

Sometimes you need to preload some data before rendering the component, for example, you want to fetch the user data before rendering the profile page, or you want to fetch the list of categories before rendering the posts page, this is where `preload` utility comes in handy.

`preload( Component: React.ComponentType<any>, promise: Promise<any>, configurations: string = "data"): React.ReactNode`

```tsx

import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
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
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
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
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, fetch('/api/user'));
```

You will receive `isLoading` flag to tell you if the request is being loaded, and `error` object if the request failed.

> If loadingErrorComponent is not defined, then null will be returned during loading or on error occurs

### Multiple Requests

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

Sometimes there are requests that depend on each other, for example, you want to fetch the user data first, then fetch the user's posts, this is where `pipeline` comes in handy.

```tsx
import { preload, pipeline } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, pipeline([
  (props) => fetch('/api/user'),
  (props, userResponse, responsesList) => fetch('/api/posts?userId=' + userResponse.data.id),
]));
```

This will load the first request, then the second request, and then the third request, each request will receive the component props besides the previous responses, by receiving `responses` or if you want only to receive the previous response of the current request, you may receive `response` property, finally the data will be passed as an `array` from all requests to the component.

## Response Cache

Now you can cache the response of a request, so if the request is already cached, it will be returned from the cache instead of sending the request again.

```tsx
import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, () => fetch('/api/user'), {
  cache: {
    key: 'user',
    expiresAfter: 60 * 5, // 5 minutes
  }
});
```

Now when the user hits this page, the request will be sent, and the response will be cached, so if the user hits this page again, the request will not be sent, and the response will be returned from the cache.

You can also customize the cache key as it can receive the component props to determine which key to use.

```tsx
import { preload } from '@mongez/react-utils';

function ViewUser({ response }) {
  const user = response.data.user;

  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
    </div>
  )
}

export default preload(ViewUser, (props) => fetch('/api/user/' + props.id), {
  cache: {
    key: ( {params} ) => 'user-' + params.id,
    expiresAfter: 60 * 5, // 5 minutes
  }
});
```

You can also set the default expire time using `setPreloadConfiguration` function.

```tsx
import { preload, setPreloadConfiguration } from '@mongez/react-utils';

setPreloadConfiguration({
  cache: {
    expiresAfter: 60 * 5, // 5 minutes
  }
});
```

## Listen for success or error

You can listen for success or error of the request by passing the `onSuccess` or `onError` callbacks to the `preload` function.

```tsx
import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, () => fetch('/api/user'), {
  onSuccess: (response) => {
    // do something
  },
  onError: (error) => {
    // do something
  }
});
```

If the request (2nd argument) is an array of requests, then the `onSuccess` will receive an array of responses, and the `onError` will receive an array of errors.

> These can defined in the `setPreloadConfiguration` function as well.

> If defined in both preload function and `setPreloadConfiguration` function, the one defined in the `preload` function will be used.

### Caching

> Added in V1.3.0

You can cache the request response by passing the `cache` option to the `preload` function, which defaults to `true`.

```tsx
import { preload } from '@mongez/react-utils';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, () => fetch('/api/user'), {
  cache: true
});
```

Now whenever the component is rendered, the request will be loaded only once, and the response will be cached, and the next time the component is rendered, the cached response will be used.

This will enhance the performance significantly, and it will be useful when you have a component that is rendered multiple times, for example, a list of items, and each item has a request to be loaded.

The cache key is the signature of the request call, so if any parameter is changed it will generate a new cache and send a new request.

You can also set default cache option using `setPreloadConfiguration` function.

```tsx
import { preload, setPreloadConfiguration } from '@mongez/react-utils';

setPreloadConfiguration({
  cache: true
});

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default preload(Profile, () => fetch('/api/user'));
```

## Guarded

> Added in V1.3.0

The `guarded` function is used to guard the component from being rendered if the given condition is not met.

```tsx
import { guarded } from '@mongez/react-utils';
import user from 'somewhere';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default guarded(Profile, () => user.isLoggedIn());
```

If the output of the callback is `true`, then the component will be rendered, otherwise the returned value of the callback will be returned instead.

```tsx
import { guarded } from '@mongez/react-utils';
import user from 'somewhere';

function Profile({ response }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>Name: {response.data.name}</div>
      <div>Email: {response.data.email}</div>
    </div>
  )
}

export default guarded(Profile, () => {
  if (!user.isLoggedIn()) {
    return <Redirect to="/login" />
  }

  return true;
});
```
