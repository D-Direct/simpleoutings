import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface InquiryAutoResponseEmailProps {
  guestName: string;
  propertyName: string;
  propertyEmail?: string;
  propertyPhone?: string;
}

export default function InquiryAutoResponseEmail({
  guestName,
  propertyName,
  propertyEmail,
  propertyPhone,
}: InquiryAutoResponseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your inquiry about {propertyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Inquiry</Heading>
          <Text style={text}>
            Dear {guestName},
          </Text>
          <Text style={text}>
            Thank you for your interest in <strong>{propertyName}</strong>. We have received your message and will get back to you as soon as possible.
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>What Happens Next?</Heading>
            <Text style={text}>
              Our team will review your inquiry and respond within 24 hours. If you have any urgent questions, please feel free to contact us directly:
            </Text>
            {propertyEmail && (
              <Text style={text}>
                <strong>Email:</strong> {propertyEmail}
              </Text>
            )}
            {propertyPhone && (
              <Text style={text}>
                <strong>Phone:</strong> {propertyPhone}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            We look forward to hosting you at {propertyName}!
          </Text>
          <Text style={footer}>
            Best regards,<br />
            The {propertyName} Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#1c1917",
  fontSize: "24px",
  fontWeight: "700",
  margin: "40px 0 20px",
  padding: "0 40px",
};

const h2 = {
  color: "#1c1917",
  fontSize: "18px",
  fontWeight: "600",
  margin: "20px 0 10px",
  padding: "0 40px",
};

const text = {
  color: "#44403c",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e7e5e4",
  margin: "20px 0",
};

const footer = {
  color: "#78716c",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 40px",
  marginTop: "20px",
};
