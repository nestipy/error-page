import { MdOutlineError } from "react-icons/md";
import nestipy from './assets/nestipy.png'
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import _data from './error.json'
import { Prism } from 'react-syntax-highlighter';
import './assets/dracula.css'
import { LineRenderer } from "./components/LineRenderer.tsx";


function App() {
    const [stackTrack, setStackTrack] = useState<typeof _data | undefined>(undefined)
    const [trackBack, setTrackBack] = React.useState<typeof _data.traceback[number] | undefined>();
    const scrollTo = useCallback((id: string) => {

        const codeBlock = document.getElementById('code-block');
        const violation = document.getElementById(id);

        if (codeBlock && violation) {
            codeBlock!.scrollTo({
                top: violation!.offsetTop - 300,
                left: 0,
                behavior: "instant"
            });
        }
    }, [])


    useEffect(() => {
        if (trackBack && stackTrack) {
            scrollTo(`${stackTrack.root}/${trackBack.filename}-${trackBack.lineno}`)
        }

    }, [scrollTo, stackTrack, trackBack]);

    useEffect(() => {
        const dataSelector = document.getElementById('error-data')
        if (dataSelector) {
            const json = JSON.parse(dataSelector.getAttribute('data-json') ?? '')
            const t = json.traceback
            console.log(t.reverse()[0])
            setTrackBack(t[0])
            setStackTrack(json)
        }

    }, []);


    return <div className="w-full flex-1 flex items-center flex-col py-12 gap-y-10 px-4 ">
        {/*<div id="error-data" data-json={JSON.stringify(_data)}/>*/}
        <div
            className="flex flex-1 max-w-[1200px] w-full justify-between rounded-md gap-x-5b items-center lg:items-center ">
            <div className="w-auto flex-1 items-center flex gap-x-5">
                <div className="flex rounded-[50px] w-[50px] h-[50px] bg-red-800/30 justify-center items-center">
                    <MdOutlineError className="text-red-400" size={20}/>
                </div>
                <div className="font-bold capitalize text-xl">
                    {stackTrack?.exception}
                </div>
            </div>
            <div className="pr-3">
                <img src={nestipy} height={30} width={30} alt="Logo"/>
            </div>
        </div>
        <div
            className="gap-y-6 lg:gap-0 flex flex-col lg:flex-row flex-1 max-w-[1200px] w-full py-8 justify-between bg-gray-900/80 px-8 rounded-md gap-x-5b border border-gray-800">
            <div className="flex-1 flex flex-col gap-y-4 items-start  ">
                <div className="capitalize bg-red-800/30 px-4 py-1 rounded-3xl text-red-600 text-sm">
                    {stackTrack?.type}
                </div>
                <div className="font-bold text-lg px-4 break-words text-wrap">
                    {stackTrack?.message}
                </div>
            </div>
            <div className="flex flex-col gap-y-4 items-start lg:items-end text-sm">
                <div className="px-4 text-gray-200 bg-gray-400/10 py-2 rounded-3xl text-sm">
                    {stackTrack?.request.method.toUpperCase()} {stackTrack?.request.host}
                </div>
                <div className="capitalize px-4 text-green-700">
                    Python {stackTrack?.framework.python} — Nestipy {stackTrack?.framework.nestipy}
                </div>
            </div>
        </div>
        <div
            className="flex flex-1 flex-col lg:flex-row gap-x-5 max-w-[1200px] w-full bg-gray-900/80 py-8 px-8 lg:p-8  border border-gray-800 rounded-md">
            <div
                className="w-full lg:w-[300px] py-6 lg:p-6 rounded-md text-gray-300 text-sm flex flex-col gap-y-2 max-h-[650px] scrollbar-none overflow-y-auto">
                {(stackTrack?.traceback ?? []).map((track) => {
                    return (
                        <div key={`${track.is_package ? '' : stackTrack?.root + '/'}${track.filename}-${track.lineno}`}
                             onClick={() => setTrackBack(track)}
                             className={JSON.stringify(track) !== JSON.stringify(trackBack) ? "cursor-pointer w-full p-3 rounded-sm bg-gray-800/20 text-wrap break-words" : 'text-wrap break-words border-l-2 border-l-red-800 border border-gray-800 py-5 cursor-pointer w-full p-3 rounded-sm bg-gray-800/20 text-gray-200'}>
                            <span>{track.filename} :{track.lineno}</span>
                        </div>)
                })}
            </div>
            <div className="flex flex-col flex-1 w-full lg:w-3/5 gap-y-6  pt-6">
                {trackBack && (
                    <div className="relative !bg-gray-800/40 rounded-md  shadow-md text-sm">
                        <div className="text-sm text-gray-400 px-8 py-6 break-words text-wrap">
                            <a className="hover:underline" target="_blank" href={`file:/${trackBack.is_package ? '' : stackTrack?.root + '/'}${trackBack.filename}#${trackBack.lineno}`}>
                                {trackBack.is_package ? '' : stackTrack?.root + '/'}{trackBack.filename} :{trackBack.lineno}
                            </a>
                        </div>
                        <Prism
                            showLineNumbers={true}
                            customStyle={{
                                backgroundColor: 'transparent',
                                borderRadius: 8,
                                paddingTop: 20,
                                scrollbarWidth: 'none',
                                maxHeight: 500,
                                overflow: 'auto',
                                opacity: 0.85
                            }}

                            language="python"
                            lineProps={(lineNumber) => {
                                const st: CSSProperties = {display: 'block', width: '100%', padding: 2};
                                if (lineNumber  === trackBack.lineno) {
                                    st.backgroundColor = 'rgba(96,17,29,0.71)';
                                    return {
                                        style: st,
                                        id: `${stackTrack?.root}/${trackBack.filename}-${trackBack.lineno}`
                                    };
                                }
                                return {style: st}
                            }}
                            startingLineNumber={trackBack.start_line_number}
                            CodeTag={(props) => <div {...props} style={{width: '100%', display: 'flex'}}/>}
                            renderer={LineRenderer({})}
                            PreTag={(props) => <pre id="code-block" {...props}/>}
                            style={{}}>
                            {trackBack.code}
                        </Prism>
                        <div className="text-sm text-gray-500 px-6 pb-4 text-right uppercase select-none pt-4 ">
                            python
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
}

export default App
