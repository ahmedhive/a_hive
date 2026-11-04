interface IJsonLdProps {
  data: Record<string, unknown>;
}

// Renders structured data as a script tag. "<" is escaped so no value can end
// the script early.
export default function JsonLd(props: IJsonLdProps) {
  const { data } = props;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
