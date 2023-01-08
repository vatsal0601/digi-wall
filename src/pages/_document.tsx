import React from "react";
import { Html, Main, NextScript, Head } from "next/document";
import Document, {
  type DocumentInitialProps,
  type DocumentContext,
} from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): React.ReactElement {
    return (
      <Html lang="en" className="h-full scroll-smooth">
        <Head>
          <meta charSet="UTF-8" />
        </Head>
        <body className="relative min-h-full subpixel-antialiased selection:bg-rose-50 selection:text-rose-600">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
