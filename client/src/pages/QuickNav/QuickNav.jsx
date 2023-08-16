import IconNav from '../../components/IconNav/IconNav';
import styles from '../main.module.css';
import stylesNav from './QuickNav.module.css';

export default function QuickNav() {

    const servers = [{id: 1, dName: 'SS'}]

    return (
        <>
            <div className={`${stylesNav.width} ${stylesNav.bgQuick}`}>
                <IconNav dm={true} />
                {
                    servers.map((server) => (
                        <IconNav dm={false} id={server.id} disName={server.dName}/>
                    ))
                }
                
            </div>
        </>
    )
}