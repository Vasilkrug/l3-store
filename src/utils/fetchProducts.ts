import {userService} from '../services/user.service';

export const fetchProducts = async (url: string) => {
    const id = await userService.getId();
    return fetch(url, {
        headers: {
            'x-userid': id
        }
    })
};