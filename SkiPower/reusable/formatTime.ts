export const formatTime = (time: number | undefined) => {
  if(time !== undefined) {
    const getSeconds: string = `0${(time % 60)}`.slice(-2)
    const minutes: number = Math.floor(time / 60)
    const getMinutes: string = `0${minutes % 60}`.slice(-2)
    const getHours: string = `0${Math.floor(time / 3600)}`.slice(-2)
  
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  } else {
    return 'Na : Na : Na';
  }
}