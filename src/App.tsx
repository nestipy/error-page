import { CodeBlock } from "react-code-block";
import { themes } from "prism-react-renderer";
import { MdOutlineError } from "react-icons/md";
import { HiOutlineMoon } from "react-icons/hi2";
import React, { useCallback, useEffect, useState } from "react";
import data from './error.json'


function App() {
    const [stackTrack, setStackTrack] = useState<typeof data.traceback>([])
    const [trackBack, setTrackBack] = React.useState<typeof data.traceback[number] | undefined>();
    const scrollTo = useCallback((id: string) => {
        const codeBlock = document.getElementById('code-block');
        const violation = document.getElementById(id);
        console.log(violation!.offsetTop)
        codeBlock!.scrollTo({
            top: violation!.offsetTop - 300,
            left: 0,
            behavior: "instant"
        });
    }, [])

    useEffect(() => {
        if (trackBack) {
            scrollTo(`${data.root}/${trackBack.filename}-${trackBack.lineno}`)
        }

    }, [scrollTo, trackBack]);

    useEffect(() => {
        const dataSelector = document.getElementById('error-data')
        if(dataSelector){
            const json = JSON.parse(dataSelector.getAttribute('data-json') ??'')
            const t = json.traceback
            console.log(t.reverse()[0])
            setTrackBack(t[0])
            setStackTrack(t)
        }

    }, []);

    return <div className="w-full flex-1 flex items-center flex-col py-12 gap-y-10 ">
            <div id="error-data" data-json={JSON.stringify(data)} />
        <div
            className="flex flex-1 max-w-[1200px] w-full pt-12 justify-between rounded-md gap-x-5b items-center lg:items-start ">
            <div className="w-auto flex-1 items-center flex gap-x-5">
                <div className="flex rounded-[50px] w-[50px] h-[50px] bg-red-800/30 justify-center items-center">
                    <MdOutlineError className="text-red-400" size={20}/>
                </div>
                <div className="font-bold capitalize text-xl">
                    {data.exception}
                </div>
            </div>
            <div className="">
                <HiOutlineMoon size={20}/>
            </div>
        </div>
        <div
            className="gap-y-6 lg:gap-0 flex flex-col lg:flex-row flex-1 max-w-[1200px] w-full py-8 justify-between bg-gray-900/80 px-8 rounded-md gap-x-5b border border-gray-800">
            <div className="flex-1 flex flex-col gap-y-4 items-start  ">
                <div className="capitalize bg-red-800/30 px-4 py-1 rounded-3xl text-red-600 text-sm">
                    {data.type}
                </div>
                <div className="font-bold capitalize text-lg px-4">
                    {data.message}
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-y-4 items-start lg:items-end text-sm">
                <div className="capitalize px-4 text-gray-200 bg-gray-400/10 py-2 rounded-3xl text-sm">
                    {data.request.method.toUpperCase()} {data.request.host}
                </div>
                <div className="capitalize px-4 text-gray-400">
                    Python {data.framework.python} -- Nestipy {data.framework.nestipy}
                </div>
            </div>
        </div>
        <div
            className="flex flex-1 flex-col lg:flex-row gap-x-5 max-w-[1200px] w-full bg-gray-900/80 py-8 px-8 lg:p-8  border border-gray-800 rounded-md">
            <div className="w-full lg:w-[300px] py-6 lg:p-6 rounded-md text-gray-300 text-sm flex flex-col gap-y-2 max-h-[600px] scrollbar-none overflow-y-auto">
                {stackTrack.map((track) => {
                    return (
                        <div key={`${track.is_package ? '': data.root+ '/'}${track.filename}-${track.lineno}`} onClick={() => setTrackBack(track)}
                             className={JSON.stringify(track) !== JSON.stringify(trackBack) ? "cursor-pointer w-full p-3 rounded-sm bg-gray-800/20 text-wrap break-words" : 'text-wrap break-words border-l-2 border-l-red-400 border border-gray-800 py-5 cursor-pointer w-full p-3 rounded-sm bg-gray-800/20 text-gray-200'}>
                            <span>{track.filename} :{track.lineno}</span>
                        </div>)
                })}
            </div>
            <div className="flex flex-col flex-1 w-full lg:w-3/5 gap-y-6">
                {trackBack && (<CodeBlock
                    theme={themes.dracula} code={trackBack.code} lines={[trackBack.lineno]}
                    language="python">
                    <div
                        className=" relative !bg-gray-800/40 rounded-lg  shadow-md text-sm ">{/* Filename */}
                        <div
                            className="text-sm text-gray-400 px-8 py-6">{trackBack.is_package ? '': data.root+ '/'}{trackBack.filename} :{trackBack.lineno}</div>
                        <CodeBlock.Code
                            id="code-block"
                            className="!px-0 max-h-[500px] overflow-auto scrollbar-none">
                            {({isLineHighlighted, lineNumber}) => (
                                <div
                                    className={`table-row ${
                                        isLineHighlighted ? 'bg-red-700/20' : 'opacity-60'
                                    }`}
                                    {...lineNumber === trackBack.lineno ? {id: `${data.root}/${trackBack.filename}-${trackBack.lineno}`} : {}}
                                >
                                    <span
                                        className={`table-cell pl-6 pr-4 text-sm text-right select-none ${
                                            isLineHighlighted ? 'text-gray-200' : 'text-gray-200'
                                        }`}
                                    >{lineNumber}</span>
                                    <CodeBlock.LineContent className="table-cell w-full pr-6 py-1">
                                        <CodeBlock.Token/>
                                    </CodeBlock.LineContent>
                                </div>
                            )}
                        </CodeBlock.Code>
                        <div className="text-sm text-gray-500 px-6 pb-4 text-right uppercase select-none pt-4 ">
                            python
                        </div>
                    </div>
                </CodeBlock>)}
            </div>
        </div>
    </div>
}

export default App
