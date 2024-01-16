import { AppDispatch, RootState } from '../states/store';
import { useSelector, useDispatch } from 'react-redux';

export function useGetStoreState<Type extends keyof RootState>(name: Type): [RootState[Type], any] {
    const state = useSelector((state: RootState) => state[name]);
    const dispatch = useDispatch<AppDispatch>();
    return [state, dispatch];
}
