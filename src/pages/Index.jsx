import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Image, Link, Icon, Spinner } from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";

const Index = () => {
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/search?q=genre:kurdish,english,turkish&type=track&limit=50", {
          headers: {
            Authorization: "Bearer YOUR_SPOTIFY_ACCESS_TOKEN",
          },
        });
        const data = await response.json();
        const tracks = data.tracks.items;
        const randomSong = tracks[Math.floor(Math.random() * tracks.length)];
        setSong(randomSong);

        const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${randomSong.artists[0].name}/${randomSong.name}`);
        const lyricsData = await lyricsResponse.json();
        setLyrics(lyricsData.lyrics || "Sözler bulunamadı.");

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
            <Image src={song.album.images[0].url} alt={song.name} mb={4} />
            <Heading as="h2" size="lg" mb={2}>
              {song.name}
            </Heading>
            <Text fontSize="xl" mb={2}>
              {song.artists[0].name}
            </Text>
            <Text fontSize="lg" mb={4}>
              Süre: {Math.floor(song.duration_ms / 60000)}:{(song.duration_ms % 60000) / 1000}
            </Text>
            <Link href={song.external_urls.spotify} isExternal>
              <Icon as={FaSpotify} boxSize={8} />
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
