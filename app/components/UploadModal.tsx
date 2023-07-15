'use client';

import { useForm } from 'react-hook-form';
import { FieldValues, SubmitHandler } from 'react-hook-form/dist/types';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import uniqid from 'uniqid';
import { useRouter } from 'next/navigation';

import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useUser } from '@/hooks/UseUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const UploadModal = () => {
    const router = useRouter();
    const uploadModal = useUploadModal();
    const [isLoading, setIsloading] = useState(false);
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues:{
            author: '',
            title: '',
            song: null,
            image: null
        }
    })

    const onChange = (open: Boolean) => {
        if(!open) {
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit:SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsloading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user) {
                toast.error('Missing Fields');
                return;
            }

            const uid = uniqid();

            // Upload song

            const {
                data: songData,
                error:songError,
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uid}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if(songError) {
                setIsloading(false);
                return toast.error('Failed song upload');
            }

            // Upload image

            const {
                data: imageData,
                error:imageError,
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uid}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })
            if(imageError) {
                setIsloading(false);
                return toast.error('Failed iamge upload');
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path
                });
            if(supabaseError) {
                setIsloading(false);
                return toast.error('Supabase error');
            }
            router.refresh();
            setIsloading(false);
            toast.success('Song created!');
            reset();
            uploadModal.onClose();
        } catch (error) {
            toast.error('Something went wrong!')
        } finally {
            setIsloading(false);
        }
    }

    return (
        <Modal
            title='Add a song'
            description='Upload an mp3 file'
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-y-4'
            >
                <Input 
                    id='title'
                    placeholder='Song title'
                    disabled={isLoading}
                    {...register('title', {required: true})}
                />
                <Input 
                    id='author'
                    placeholder='Song author'
                    disabled={isLoading}
                    {...register('author', {required: true})}
                />
                <div className="">
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input 
                        id='song'
                        type='file'
                        accept='.mp3'
                        disabled={isLoading}
                        {...register('song', {required: true})}
                    />  
                </div>
                <div className="">
                    <div className="pb-1">
                        Select an image
                    </div>
                    <Input 
                        id='image'
                        type='file'
                        accept='iamge/*'
                        disabled={isLoading}
                        {...register('image', {required: true})}
                    />  
                </div>
                <Button disabled={isLoading} type='submit'>Create</Button>
            </form>
        </Modal>
    )
}

export default UploadModal