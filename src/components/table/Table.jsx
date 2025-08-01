import React, {useState, useEffect} from 'react'

import './table.css'

const Table = props => {

    const initDataShow = props.limit && props.bodyData ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData

    const [dataShow, setDataShow] = useState(initDataShow)

    let pages = 1

    let range = []

    useEffect(() => {
        if (props.bodyData) {
            const initData = props.limit
                ? props.bodyData.slice(0, Number(props.limit))
                : props.bodyData;

            setDataShow(initData);

            // Reset current page on data change
            setCurrPage(0);
        }
    }, [props.bodyData, props.limit]);

    if (props.limit !== undefined) {
        let page = Math.floor(props.bodyData.length / Number(props.limit))
        pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1
        range = [...Array(pages).keys()]
    }

    const [currPage, setCurrPage] = useState(0)

    const selectPage = page => {
        const start = Number(props.limit) * page
        const end = start + Number(props.limit)

        setDataShow(props.bodyData.slice(start, end))

        setCurrPage(page)
    }

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {
                        props.headData && props.renderHead ? (
                            <thead>
                                <tr>
                                    {
                                        props.headData.map((item, index) => props.renderHead(item, index))
                                    }
                                </tr>
                            </thead>
                        ) : null
                    }
                    {
                        props.bodyData && props.renderBody ? (
                            <tbody>
                                {
                                    dataShow.map((item, index) => props.renderBody(item, index))
                                }
                            </tbody>
                        ) : null
                    }
                </table>
            </div>
            {
                pages > 1 ? (
                    <div className="table__pagination">
                        {
                            pages > 1 && (
                                <div className="table__pagination">
                                    {/* Left arrow */}
                                    {currPage > 0 && (
                                        <div className="table__pagination-item" onClick={() => selectPage(currPage - 1)}>
                                            ‹
                                        </div>
                                    )}

                                    {/* Page numbers (only 5 visible) */}
                                    {
                                        range
                                            .slice(
                                                Math.max(0, Math.min(currPage - 2, pages - 5)),
                                                Math.max(0, Math.min(currPage - 2, pages - 5)) + 5
                                            )
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`table__pagination-item ${currPage === item ? 'active' : ''}`}
                                                    onClick={() => selectPage(item)}
                                                >
                                                    {item + 1}
                                                </div>
                                            ))
                                    }

                                    {/* Right arrow */}
                                    {currPage < pages - 1 && (
                                        <div className="table__pagination-item" onClick={() => selectPage(currPage + 1)}>
                                            ›
                                        </div>
                                    )}
                                </div>
                            )
                        }

                    </div>
                ) : null
            }
        </div>
    )
}

export default Table
