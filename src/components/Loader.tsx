
const Loader = () => {
    return (
        <section className="loader">
            <div></div>
        </section>

        // <div>....</div>
    )
}

export default Loader;


interface SkeletonProps {
    width?: string;
    length?: number;
    height?: string;
    containerHeight?: string;
}

export const SkeletonLoader = ({ height = "30px", width = "unset", length = 3, containerHeight = "unset" }: SkeletonProps) => {

    const skeletons = Array.from({ length }, (_, idx) => (
        <div key={idx} className="skeleton-shape" style={{ height }}></div>
    ));

    return (
        <div className="skeleton-loader" style={{ width, height: containerHeight }}>
            {skeletons}
        </div>
    )
}