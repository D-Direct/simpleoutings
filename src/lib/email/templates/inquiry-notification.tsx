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

interface InquiryNotificationEmailProps {
  propertyName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  message: string;
}

export default function InquiryNotificationEmail({
  propertyName,
  guestName,
  guestEmail,
  guestPhone,
  message,
}: InquiryNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New inquiry from {guestName} for {propertyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Inquiry Received</Heading>
          <Text style={text}>
            You have received a new inquiry for <strong>{propertyName}</strong>
          </Text>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Guest Details</Heading>
            <Text style={text}>
              <strong>Name:</strong> {guestName}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {guestEmail}
            </Text>
            {guestPhone && (
              <Text style={text}>
                <strong>Phone:</strong> {guestPhone}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Please respond to {guestEmail} as soon as possible to convert this inquiry into a booking.
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

const messageText = {
  color: "#44403c",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "20px 40px",
  backgroundColor: "#f5f5f4",
  borderRadius: "8px",
  margin: "0 40px",
  whiteSpace: "pre-wrap" as const,
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
