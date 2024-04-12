import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Image, Link, Icon, Spinner } from "@chakra-ui/react";
import { FaYoutube } from "react-icons/fa";

const Index = () => {
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=kurdish,english,turkish%20music&key=YOUR_YOUTUBE_API_KEY");
        const data = await response.json();
        const videos = data.items;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        setSong({
          title: randomVideo.snippet.title,
          artist: randomVideo.snippet.channelTitle,
          thumbnail: randomVideo.snippet.thumbnails.high.url,
          videoId: randomVideo.id.videoId,
        });
        setLyrics("Sözler YouTube'da mevcut değil.");

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching song:", error);
        setIsLoading(false);
      }
    };

    fetchSong();
  }, []);

  return (
    <Flex direction={["column", "row"]} align="center" justify="center" minHeight="100vh" p={8}>
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <>
          <Box width={["100%", "40%"]} mb={[8, 0]} mr={[0, 8]}>
            <Image src={song.thumbnail} alt={song.title} mb={4} />
            <Heading as="h2" size="lg" mb={2}>
              {song.title}
            </Heading>
            <Text fontSize="xl" mb={2}>
              {song.artist}
            </Text>
            <Link href={`https://www.youtube.com/watch?v=${song.videoId}`} isExternal>
              <Icon as={FaYoutube} boxSize={8} />
            </Link>
          </Box>
          <Box width={["100%", "60%"]}>
            <Heading as="h3" size="lg" mb={4}>
              Şarkı Sözleri
            </Heading>
            <Text whiteSpace="pre-wrap">{lyrics}</Text>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Index;
