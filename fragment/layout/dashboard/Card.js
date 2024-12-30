
const Card=({items})=>{
    return (
        <div className="flex flex-col gap-4">
            {items.map((row, index) => (
                <div className="flex flex-wrap gap-4" key={index}>
                    {row.map((item, index) => (
                        <div className={`rounded-sm border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark ${item.style || "flex-1"}`} key={index}>
                        <div className="flex flex-row items-center gap-4">
                            <div className="bg-slate-300 rounded-full p-3 w-fit">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-title-md font-bold text-black dark:text-white">
                                    {item.title}
                                </h4>
                                <span className="text-sm font-medium">{item.subtitle}</span>
                            </div>
                        </div>
                        
                            <div className="mt-4 flex flex-col gap-2 h-60 max-h-60 overflow-y-auto">
                                {item.body(item.value)}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Card;