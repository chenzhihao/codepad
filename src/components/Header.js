import Head from 'next/head';
import React from 'react';

export default function Header () {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <meta httpEquiv="X-UA-Compatible"
              content="ie=edge"
      />
      <title>Code Pad</title>
      <link href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAADc3NwAAAAAAENDQwD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERIiESIREhERIwAiMyIjIRESMzMzMzMhERIzMzMzMyERIjMzMjMzIRICMzMgIzMhEjMzMzIzMhERIzMzMzMyEREjMyIjMzIRESMzMzMzMhERIzIzMjMyEREjMzMzMzIRERIzMzMzIREREjMzMzMhERERIiIiIhERERERERERERHjOwAAwAEAAOABAADgAQAAwAEAAIABAACAAwAAwAMAAMADAADAAwAAwAMAAMADAADgBwAA4AcAAPAPAAD//wAA"
              rel="icon"
              type="image/x-icon"
      />
    </Head>
  );
};
