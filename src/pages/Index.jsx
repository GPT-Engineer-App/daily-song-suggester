import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Image, Link, Icon, Spinner } from "@chakra-ui/react";
import { FaMusic } from "react-icons/fa";

const Index = () => {
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch("https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=50&country=tr&f_has_lyrics=1&apikey=3b1aa45594419463207c089876070291");
        const data = await response.json();
        const tracks = data.message.body.track_list;
        const randomSong = tracks[Math.floor(Math.random() * tracks.length)].track;
        setSong(randomSong);

        const lyricsResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${randomSong.track_id}&apikey=3b1aa45594419463207c089876070291`);
        const lyricsData = await lyricsResponse.json();
        setLyrics(lyricsData.message.body.lyrics.lyrics_body || "Sözler bulunamadı.");

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
            <Image src={`https://s.mxmcdn.net/images-storage/albums/${song.album_id.slice(0, 3)}/${song.album_id.slice(3, 6)}/${song.album_id}.jpg`} alt={song.track_name} mb={4} />
            <Heading as="h2" size="lg" mb={2}>
              {song.track_name}
            </Heading>
            <Text fontSize="xl" mb={2}>
              {song.artist_name}
            </Text>
            <Text fontSize="lg" mb={4}>
              Süre: {Math.floor(song.track_length / 60)}:{song.track_length % 60}
            </Text>
            <Link href={`https://www.musixmatch.com/lyrics/${song.artist_name}/${song.track_name}`} isExternal>
              <Icon as={FaMusic} boxSize={8} />
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
