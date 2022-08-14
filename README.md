# React Utils

Some good utilities to use in your React Js/ React Native Apps

## Installation

`yarn add @mongez/react-utils`

Or

`npm i @mongez/react-utils`

## Usage

## Map Elements

Loop over the given array and render the given component for each element in the array.

`mapElements( data: any[], Component: React.ElementType, as: string | ((item: any, index: number) => object) = "item", key: string = "id", ): React.ReactNode`

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

function PostCard({post}: any) {
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

function PostCard({post}: any) {
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

function PostCard({title, image}: any) {
  return (
    <div>
        <div className="title">{title}</div>
        <img src={image} />
    </div>
  )
}
```

Of course this function will add the `key` automatically so you don't have to bother yourself about it.

By default the key will be taken from the item's id, otherwise it will be the item's index in the array.

You can override it by passing the 4th argument the name of the key.
