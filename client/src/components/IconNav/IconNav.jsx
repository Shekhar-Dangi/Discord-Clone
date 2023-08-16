import styles from './IconNav.module.css';
import DMIcon from '../DMIcon/DMIcon';
import {Link} from 'react-router-dom'
import { useEffect } from 'react';

export default function IconNav({dm, id, disName="SS"}) {
    const IconClasses = `${dm ? styles.backBlue : ""} ${dm ? "" : styles.server} ${styles.icon}`
    
    return (
        <>
            <div className={`${IconClasses}`}>
                {dm ? <DMIcon /> : disName}
            </div>
        </>
    )
}