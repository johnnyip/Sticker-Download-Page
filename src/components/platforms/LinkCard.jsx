import { Badge, Button, Card, Group, Text } from '@mantine/core';

export default function LinkCard({ data, id, installed, setDownloaded }) {
  return (
    <div className="link-card-desktop">
      <Card shadow="sm" p="xs" radius="md" withBorder style={{ backgroundColor: installed ? '#CDFFC4' : '' }}>
        <Card.Section>
          <div>
            <img className="center" src={data.thumbnail} height={160} alt={data.name} />
          </div>
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{data.name}</Text>
          {data.new ? (
            <Badge color="pink" variant="light" radius="xs">
              New
            </Badge>
          ) : null}
        </Group>

        <Text size="sm" color="dimmed">
          {data.category}
        </Text>

        {data.url2 ? (
          <>
            <a href={data.url} target="_blank" rel="noreferrer" style={{ textDecorationLine: 'none' }}>
              <Button
                variant="light"
                color="gray"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  setDownloaded(id);
                }}
              >
                下載(Whatsticker, 靜態)
              </Button>
            </a>
            <a href={data.url2} target="_blank" rel="noreferrer" style={{ textDecorationLine: 'none' }}>
              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  setDownloaded(id);
                }}
              >
                後備下載(Sticker Maker, {data.animated ? '動+靜態' : '靜態'})
              </Button>
            </a>
          </>
        ) : (
          <a href={data.url} target="_blank" rel="noreferrer" style={{ textDecorationLine: 'none' }}>
            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => {
                setDownloaded(id);
              }}
            >
              下載
            </Button>
          </a>
        )}
      </Card>
    </div>
  );
}
