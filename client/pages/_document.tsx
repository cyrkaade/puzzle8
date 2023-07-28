import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/reallogo.ico" />
          <meta
            name="description"
            content="Generate interesting puzzles in seconds."
          />
          <meta property="og:site_name" content="sherlck.me" />
          <meta
            property="og:description"
            content="Generate interesting puzzles in seconds."
          />
          <meta property="og:title" content="Puzzle Generator" />
          <meta name="new:card" content="summary_large_image" />
          <meta name="new:title" content="Puzzle Generator" />
          <meta
            name="new:description"
            content="Generate interesting puzzles in seconds."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
