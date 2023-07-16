import { Song } from "@/types";
import usePlayer from "./usePLayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./UseUser";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const { user } = useUser();

    const onPlay = (id: string) => {
        if(!user) {
            return authModal.onOpen();
        }

        player.setId(id);
        player.setIds(songs.map((song) => song.id));
    };

    return onPlay;
}

export default useOnPlay;