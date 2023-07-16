'use client';

import MediaItem from "@/app/components/MediaItem";
import { Song } from "@/types";

interface SearchContentProps {
    songs: Song[];
}

const SearchContent:React.FC<SearchContentProps> = ({
    songs
}) => {
    if(!songs) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No songs found.
            </div>  
        )
    }
    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full">
                    <div className="flex-1">
                        <MediaItem 
                            onClick={() => {}}
                            data={song}
                        /> 
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SearchContent